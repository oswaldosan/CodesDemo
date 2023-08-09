//Yes or no Copay Form Validation
add_filter( 'gform_validation_3', 'custom_validation' );
function custom_validation( $validation_result ) {
    $form = $validation_result['form'];
  
    //select the 29 input
    if ( rgpost( 'input_29' ) == 'Yes' ) {
  
        // set the form validation to false
        $validation_result['is_valid'] = false;
  
        //finding Field with ID of 1 and marking it as failed validation
        foreach( $form['fields'] as &$field ) {
  
            //NOTE: replace 1 with the field you would like to validate 
            if ( $field->id == '29' ) {
                $field->failed_validation = true;
                $field->validation_message = 'The QSavings Card is not available to patients enrolled in federal or state healthcare programs, including Medicare Part D, Medicaid, Medigap, VA, or DoD programs.';
                break;
            }
        }
    }
    //Assign modified $form object back to the validation result
    $validation_result['form'] = $form;
    return $validation_result;
}

// Add Lottie player global on header. 
add_action( 'wp_enqueue_scripts', 'lottie_player' );
function lottie_player() {
    $theme_version = wp_get_theme()->get( 'Version' );

	wp_enqueue_script( 'lottie-player', 'https://unpkg.com/@lottiefiles/lottie-player@v1.5.8/dist/lottie-player.js', array(), $theme_version );

}