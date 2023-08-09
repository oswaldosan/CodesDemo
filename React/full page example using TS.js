import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { ColumnDef, Row, RowData } from '@tanstack/react-table'
import {
  Button,
  Checkbox,
  EmptyState,
  MenuDropdown,
  Table,
} from '@invafresh/shared-components'
import {
  FormattedMessage,
  FormattedPlural,
  MessageDescriptor,
  useIntl,
} from 'react-intl'
import { useNavigate } from '@routes'
import { WhiteContainer } from '@shared/components/WhiteContainer'
import Restricted from '@security/Restricted'
import { Permissions } from '@service/Permission/tokenList'
import useStoreGroups from '@service/useStoreGroups'
import useDeleteStoreGroup from '@service/useDeleteStoreGroup'
import ActionsContainer from '@shared/components/ActionsContainer'
import PageBreadcrumbs from '@shared/components/PageBreadcrumbs'
import ConfirmationModal from '@shared/components/ConfirmationModal'
import invaToast from '@shared/components/Toast'
import Loading from '@shared/components/Loading'
import { StoreGroup, StoreGroupDeleteResponse } from '@api/types/global'
import { dateConverter } from '@utils/dateConverter'
import { useQueryClient } from 'react-query'
import { StoreGroupsRoutes } from '@routes/routerPaths'
import {
  StyledDeleteIcon,
  StyledDeleteMenuWrapper,
  StyledEllipsisCellAbsolute,
  StyledEllipsisCellWrapper,
  StyledEllipsisIcon,
  StyledFilterIcon,
  StyledPlusIcon,
  StyledSearch,
  StyledStoreGroupDate,
  StyledStoreGroupName,
  BlueDot,
  CellRelative,
  StyledTableHeaderActions,
} from './Styles'

interface Props {
  warningTimeout?: number
}

const MENU_DROPDOWN_OPTIONS = [
  { label: 'button.delete' as MessageDescriptor['id'], value: 'delete' },
]

const StoreGroupsPage: React.FunctionComponent<Props> = ({
  warningTimeout = 60000,
}) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [selectedRows, setSelectedRows] = useState<Object[]>([])
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [openMenuDelete, setOpenMenuDelete] = useState(false)
  const [selectedTableRowIdx, setHoverTableIdx] = useState(-1)
  const { isLoading: loadingList, isFetched, data } = useStoreGroups()
  const { formatMessage } = useIntl()
  const { mutateAsync: deleteStoreGroup, isLoading: loadingDelete } =
    useDeleteStoreGroup()

  const componentIsLoading = loadingList || loadingDelete
  const [lastEdited] = useState<string | null>(
    localStorage.getItem('last-storeGroup-saved')
  )

  useEffect(() => {
    localStorage.removeItem('last-storeGroup-saved')
  }, [navigate])

  const handleDelete = () => {
    let promiseIsPending = true

    const toDeleteStoreGroups = selectedRows.map((selectedRow) => {
      const storeGroupId = Number((selectedRow as Row<StoreGroup>).original.id)
      return deleteStoreGroup(storeGroupId)
    })

    setTimeout(() => {
      if (promiseIsPending) {
        invaToast({
          variant: 'warning',
          message: formatMessage({ id: 'delete.storeGroups.snackbar.timeout' }),
        })
      }
    }, warningTimeout)

    changeModalState()

    Promise.allSettled(toDeleteStoreGroups)
      .then((results) => {
        const rejectedPromises = results.filter(
          ({ status }) => status === 'rejected'
        ) as PromiseRejectedResult[]

        const fulfilledPromises = results.filter(
          ({ status }) => status === 'fulfilled'
        ) as PromiseFulfilledResult<StoreGroupDeleteResponse>[]

        rejectedPromises.forEach(showDeletedErrorSnackbar)

        if (fulfilledPromises.length) {
          const deletedCount = fulfilledPromises.reduce((acc, cur) => {
            const total = Number(cur.value.total)
            return acc + (total >= 1 ? 1 : 0)
          }, 0)

          showDeletedSuccessfullySnackbar(deletedCount, selectedRows)
        }
      })
      .finally(() => {
        promiseIsPending = false
      })
  }

  const showDeletedErrorSnackbar = ({ reason }: PromiseRejectedResult) => {
    const params = reason.config.url.split('/')
    const lastParam = params[params.length - 1]

    if (isNaN(Number(lastParam))) {
      invaToast({ message: reason.message, variant: 'error' })
      return
    }

    const currentRow = selectedRows.find((row) => {
      const findRow = row as Row<StoreGroup>
      return lastParam === findRow.original.id ? findRow : null
    }) as Row<StoreGroup>

    invaToast({
      variant: 'error',
      message: formatMessage(
        {
          id: 'delete.storeGroups.snackbar.deleteError',
        },
        {
          storeGroup: currentRow.original.description,
          details: reason.message,
        }
      ),
    })
  }

  const changeModalState = () => {
    setOpenConfirmationModal(!openConfirmationModal)
  }

  const showDeletedSuccessfullySnackbar = (
    totalDeletedStoreGroups: number,
    deletedRows: object[]
  ) => {
    invaToast({
      variant: 'success',
      message: (
        <FormattedPlural
          value={totalDeletedStoreGroups}
          one={formatMessage(
            { id: 'delete.storeGroups.snackbar.singleRemove' },
            {
              message: (deletedRows[0] as Row<StoreGroup>).original.description,
            }
          )}
          other={formatMessage(
            { id: 'delete.storeGroups.snackbar.manyRemove' },
            { message: totalDeletedStoreGroups.toString() }
          )}
        />
      ),
    })
  }

  const handleTableHoverChange = ({ index }: Row<StoreGroup>) => {
    if (!openMenuDelete) {
      setHoverTableIdx(index)
    }
  }

  const handleTableRowClick = (_: RowData) => {
    if (openMenuDelete) {
      setOpenMenuDelete(false)
      setHoverTableIdx(-1)
    }
  }

  const handleRowEdit = (storeGroup: StoreGroup) => {
    const id = storeGroup.id
    const fullPath = StoreGroupsRoutes.edit.replace(':id', id)
    queryClient.invalidateQueries({ queryKey: ['singleStoreGroupGet'] })
    navigate(fullPath)
  }

  const columns: ColumnDef<StoreGroup>[] = [
    {
      id: 'select',
      size: 55,
      header: ({ table }) => (
        <Checkbox
          data-testid='checkbox-select-all-rows'
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          data-testid='checkbox-selected-single-row'
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      header: formatMessage({ id: 'table.header.storeGroup.description' }),
      accessorKey: 'description',
      size: 300,
      cell: ({ row }) => (
        <StyledEllipsisCellWrapper onClick={() => handleRowEdit(row.original)}>
          <StyledStoreGroupName lastEdition={lastEdited === row.original.id}>
            {row.getValue('description')}
          </StyledStoreGroupName>
          {lastEdited === row.original.id ? (
            <BlueDot data-testid='blue-edit-dot' />
          ) : (
            ''
          )}
        </StyledEllipsisCellWrapper>
      ),
    },
    {
      header: '',
      size: 999,
      cell: ({ row }) => (
        <CellRelative>
          <StyledDeleteMenuWrapper>
            <StyledEllipsisCellAbsolute>
              {selectedTableRowIdx === row.index && (
                <StyledEllipsisIcon
                  data-testid='table-row-menu-icon'
                  onClick={() => {
                    setOpenMenuDelete((prev) => !prev)
                  }}
                />
              )}
            </StyledEllipsisCellAbsolute>
            <MenuDropdown
              isOpened={selectedTableRowIdx === row.index && openMenuDelete}
              items={MENU_DROPDOWN_OPTIONS.map(({ value, label }) => ({
                value,
                label: formatMessage({ id: label }),
              }))}
              onChange={(selectedMenuOptions) => {
                if (selectedMenuOptions.length) {
                  changeModalState()
                  setOpenMenuDelete(false)
                  row.toggleSelected(true)
                }
              }}
            />
          </StyledDeleteMenuWrapper>
        </CellRelative>
      ),
      accessorKey: 'id',
    },
    {
      size: 230,
      header: formatMessage({ id: 'table.header.storeGroup.lastModified' }),
      cell: ({ row }) => (
        <StyledStoreGroupDate>
          {row.getValue('last_modify_date') ? (
            <>{dateConverter(row.getValue('last_modify_date'))}</>
          ) : (
            '--'
          )}
        </StyledStoreGroupDate>
      ),
      accessorKey: 'last_modify_date',
    },
  ]

  return (
    <>
      <ConfirmationModal
        title={formatMessage({ id: 'delete' })}
        message={formatMessage({ id: 'delete.storeGroups.modalTitle' })}
        data-testid='modal-confirmation'
        onClose={changeModalState}
        isOpen={openConfirmationModal}
      >
        <ConfirmationModal.ButtonsContainer
          warningMessage={formatMessage({
            id: 'delete.storeGroups.modalWarning',
          })}
        >
          <Button
            data-testid='modal-confirmation-cancel-button'
            variant='tertiary'
            onClick={changeModalState}
          >
            {formatMessage({ id: 'button.cancel' })}
          </Button>
          <Button
            loading={loadingDelete}
            data-testid='modal-confirmation-delete-button'
            onClick={handleDelete}
          >
            {formatMessage({ id: 'button.delete' })}
          </Button>
        </ConfirmationModal.ButtonsContainer>
      </ConfirmationModal>

      <ActionsContainer>
        <PageBreadcrumbs customPreviousPaths='/setup' />

        <ActionsContainer.Separator />

        <StyledEllipsisIcon />
      </ActionsContainer>
      <WhiteContainer>
        <StyledTableHeaderActions>
          <ActionsContainer.ButtonsWrapper>
            <Restricted to={Permissions.UR_SETUP_GENERAL_STOREGROUPS_ADD}>
              <Button
                icon={<StyledPlusIcon />}
                onClick={() => navigate(StoreGroupsRoutes.create)}
              >
                <FormattedMessage id='button.add' />
              </Button>
            </Restricted>

            <Restricted to={Permissions.UR_SETUP_GENERAL_STOREGROUPS_DELETE}>
              {selectedRows.length ? (
                <Button
                  variant='secondary'
                  data-testid='table-delete-btn'
                  onClick={changeModalState}
                  icon={<StyledDeleteIcon />}
                >
                  <FormattedMessage id='button.delete' />
                </Button>
              ) : (
                <></>
              )}
            </Restricted>
          </ActionsContainer.ButtonsWrapper>

          <ActionsContainer.Separator />

          {data?.storeGroups.length && !componentIsLoading ? (
            <ActionsContainer.FilterWrapper>
              <StyledFilterIcon />

              <StyledSearch />
            </ActionsContainer.FilterWrapper>
          ) : (
            <></>
          )}
        </StyledTableHeaderActions>

        {componentIsLoading ? (
          <Loading />
        ) : (
          <>
            {!data?.storeGroups.length && isFetched ? (
              <EmptyState
                title={formatMessage({ id: 'empty.storeGroups.title' })}
                description={formatMessage({
                  id: 'empty.storeGroups.description',
                })}
              />
            ) : null}
          </>
        )}

        {data?.storeGroups.length ? (
          <Table
            onMouseEnter={handleTableHoverChange}
            onMouseLeave={handleTableHoverChange}
            onRowClick={handleTableRowClick}
            onRowSelect={setSelectedRows}
            data={data!.storeGroups}
            columns={columns}
            customPagination={[50, 100]}
            theadStickyValue={115}
          />
        ) : null}
      </WhiteContainer>
    </>
  )
}

export default StoreGroupsPage
