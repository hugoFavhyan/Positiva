<?php
// Exit if accessed directly
if (!defined('ABSPATH')) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

if (!function_exists('chld_thm_cfg_locale_css')):
    function chld_thm_cfg_locale_css($uri)
    {
        if (empty($uri) && is_rtl() && file_exists(get_template_directory() . '/rtl.css'))
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
endif;
add_filter('locale_stylesheet_uri', 'chld_thm_cfg_locale_css');

if (!function_exists('child_theme_configurator_css')):
    function child_theme_configurator_css()
    {
        wp_enqueue_style('chld_thm_cfg_child', trailingslashit(get_stylesheet_directory_uri()) . 'style.css', array('hello-elementor', 'hello-elementor', 'hello-elementor-theme-style', 'hello-elementor-header-footer'));
    }
endif;
add_action('wp_enqueue_scripts', 'child_theme_configurator_css', 100);

// END ENQUEUE PARENT ACTION

function agregar_viewport_meta()
{
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
}
add_action('wp_head', 'agregar_viewport_meta');

add_filter('um_account_page_default_tabs_hook', function ($tabs) {
    if (!isset($tabs[500]['subir_archivos'])) {
        $tabs[500]['subir_archivos'] = [
            'icon'   => 'um-faicon-upload',
            'title'  => 'Subir Archivos',
            'custom' => true
        ];
    }
    return $tabs;
}, 100);



function content_tab($info)
{
?>
    <div class="um-field">
        <form enctype="multipart/form-data" method="post">
            <label for="file-upload">Subir Archivo:</label>
            <input type="file" name="file-upload" id="file-upload" required>
            <input type="submit" name="um_account_submit" id="um_account_submit_general" class="um-button" value="Subir archivo">
        </form>
    </div>
<?php

}
add_action('um_account_content_hook_subir_archivos', 'content_tab');

function process_upload_file()
{
    if (isset($_FILES['file-upload']) && $_FILES['file-upload']['error'] == 0) {
        // Configura la subida del archivo
        $uploaded_file = wp_handle_upload($_FILES['file-upload'], array('test_form' => false));

        if ($uploaded_file && !isset($uploaded_file['error'])) {
            // Guardar la URL del archivo en el perfil del usuario
            $user_id = get_current_user_id();
            update_user_meta($user_id, 'archivo_subido', $uploaded_file['url']);

            // Mensaje de éxito
            echo '<p class="um-notice success">Archivo subido correctamente.</p>';
        } else {
            // Mensaje de error
            echo '<p class="um-notice error">Error al subir el archivo: ' . $uploaded_file['error'] . '</p>';
        }
    }
}

add_action('init', 'process_upload_file');
