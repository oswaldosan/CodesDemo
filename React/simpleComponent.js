import React, { ReactNode } from 'react'
import { StyledContainer } from './Styles'

export interface Props {
  /**This is the children that will be displayed inside the innerWrapper container of this component. */
  children: ReactNode
}

export const WhiteContainer: React.FC<Props> = ({ children, ...props }) => {
  return (
    <StyledContainer data-testid='white-container' {...props}>
      {children}
    </StyledContainer>
  )
}
