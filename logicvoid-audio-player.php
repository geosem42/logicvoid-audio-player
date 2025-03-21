<?php
/**
 * Plugin Name: LogicVoid Audio Player (Block)
 * Description: A modern, responsive audio player as a Gutenberg block
 * Version: 1.0.0
 * Author: Logic Void
 * Author URI: https://logicvoid.dev
 * Text Domain: logicvoid-audio-player
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers all block assets so that they can be enqueued in the editor and on the frontend.
 */
function logicvoid_audio_player_register_block() {
    // Register block script
    wp_register_script(
        'logicvoid-audio-player-block-editor',
        plugins_url( 'block.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n', 'wp-blob' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'block.js' ),
        true
    );

    // Register block editor style
    wp_register_style(
        'logicvoid-audio-player-block-editor-style',
        plugins_url( 'editor-style.css', __FILE__ ),
        array( 'wp-edit-blocks' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'editor-style.css' )
    );

    // Register front-end style
    wp_register_style(
        'logicvoid-audio-player-style',
        plugins_url( 'style.css', __FILE__ ),
        array(),
        filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
    );

    // Register the block
    register_block_type( 'logicvoid-audio-player/player', array(
        'editor_script' => 'logicvoid-audio-player-block-editor',
        'editor_style'  => 'logicvoid-audio-player-block-editor-style',
        'style'         => 'logicvoid-audio-player-style',
        'attributes'    => array(
            'audioID' => array(
                'type' => 'number',
            ),
            'audioURL' => array(
                'type' => 'string',
                'default' => '',
            ),
            'title' => array(
                'type' => 'string',
                'default' => 'Audio Title',
            ),
            'description' => array(
                'type' => 'string',
                'default' => 'Listen to this episode now!',
            ),
            'imageID' => array(
                'type' => 'number',
            ),
            'imageURL' => array(
                'type' => 'string',
                'default' => '',
            ),
            'accentColor' => array(
                'type' => 'string',
                'default' => '#58a6ff',
            ),
            'backgroundColor' => array(
                'type' => 'string',
                'default' => '#0d1117',
            ),
            'textPrimaryColor' => array(
                'type' => 'string',
                'default' => '#f0f6fc',
            ),
            'textSecondaryColor' => array(
                'type' => 'string',
                'default' => '#8b949e',
            ),
            'controlBgColor' => array(
                'type' => 'string',
                'default' => '#21262d',
            ),
            'progressBgColor' => array(
                'type' => 'string',
                'default' => '#30363d',
            ),
            'borderColor' => array(
                'type' => 'string',
                'default' => '#30363d',
            ),
            'blockID' => array(
                'type' => 'string',
                'default' => '',
            ),
        ),
        'render_callback' => 'logicvoid_audio_player_render_block',
    ) );
}
add_action( 'init', 'logicvoid_audio_player_register_block' );

/**
 * Validates a hex color value
 * 
 * @param string $color The color to validate
 * @param string $default The default color to return if invalid
 * @return string A valid hex color
 */
function logicvoid_validate_hex_color($color, $default) {
    // Check if the color is a valid hex color
    if (!empty($color) && preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
        return $color;
    }
    
    // Return the default if validation fails
    return $default;
}

/**
 * Server-side rendering of the block
 */
function logicvoid_audio_player_render_block($attributes) {
    $audio_url   = !empty($attributes['audioURL']) ? esc_url($attributes['audioURL']) : '';
    $title       = !empty($attributes['title']) ? esc_html($attributes['title']) : 'Audio Title';
    $description = !empty($attributes['description']) ? esc_html($attributes['description']) : 'Listen to this episode now!';
    $image       = !empty($attributes['imageURL']) ? esc_url($attributes['imageURL']) : '';
    
    // Default colors
    $default_colors = array(
        'accent'       => '#58a6ff',
        'background'   => '#0d1117',
        'textPrimary'  => '#f0f6fc',
        'textSecondary'=> '#8b949e',
        'controlBg'    => '#21262d',
        'progressBg'   => '#30363d',
        'border'       => '#30363d',
    );
    
    // Get all color values with validation
    $accent_color = logicvoid_validate_hex_color(
        !empty($attributes['accentColor']) ? $attributes['accentColor'] : 
        (!empty($attributes['color']) ? $attributes['color'] : ''), 
        $default_colors['accent']
    );
    
    $background_color = logicvoid_validate_hex_color(
        !empty($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '', 
        $default_colors['background']
    );
    
    $text_primary_color = logicvoid_validate_hex_color(
        !empty($attributes['textPrimaryColor']) ? $attributes['textPrimaryColor'] : '', 
        $default_colors['textPrimary']
    );
    
    $text_secondary_color = logicvoid_validate_hex_color(
        !empty($attributes['textSecondaryColor']) ? $attributes['textSecondaryColor'] : '', 
        $default_colors['textSecondary']
    );
    
    $control_bg_color = logicvoid_validate_hex_color(
        !empty($attributes['controlBgColor']) ? $attributes['controlBgColor'] : '', 
        $default_colors['controlBg']
    );
    
    $progress_bg_color = logicvoid_validate_hex_color(
        !empty($attributes['progressBgColor']) ? $attributes['progressBgColor'] : '', 
        $default_colors['progressBg']
    );
    
    $border_color = logicvoid_validate_hex_color(
        !empty($attributes['borderColor']) ? $attributes['borderColor'] : '', 
        $default_colors['border']
    );
    
    $block_id = !empty($attributes['blockID']) ? esc_attr($attributes['blockID']) : 'logicvoid-audio-player-' . uniqid();
    
    if (empty($audio_url)) {
        return '<div class="components-placeholder"><div class="components-placeholder__label">LogicVoid Audio Player</div><div class="components-placeholder__instructions">Please select an audio file.</div></div>';
    }

    // Custom inline style with all color variables
    $custom_style = 'style="
        --player-accent-color: ' . $accent_color . ';
        --player-background: ' . $background_color . ';
        --player-text-primary: ' . $text_primary_color . ';
        --player-text-secondary: ' . $text_secondary_color . ';
        --player-control-bg: ' . $control_bg_color . ';
        --player-progress-bg: ' . $progress_bg_color . ';
        --player-border-color: ' . $border_color . ';
    "';

    $output = '<div class="logicvoid-audio-player-wrapper" id="' . $block_id . '" ' . $custom_style . '>';
    
    $output .= '<div class="logicvoid-audio-player-container">';
    
    // Image section
    if (!empty($attributes['imageID'])) {
        // Use WordPress attachment functions with ID
        $output .= '<div class="logicvoid-audio-player-image">';
        $output .= wp_get_attachment_image(
            $attributes['imageID'],
            'medium',
            false,
            array(
                'alt' => $title . ' cover',
                'class' => 'logicvoid-audio-player-cover'
            )
        );
        $output .= '</div>';
    } elseif (!empty($image)) {
        // If we have URL but no ID, try to get the attachment ID from URL
        $attachment_id = attachment_url_to_postid($image);
        
        $output .= '<div class="logicvoid-audio-player-image">';
        if ($attachment_id) {
            // If we found an ID, use it
            $output .= wp_get_attachment_image(
                $attachment_id,
                'medium',
                false,
                array(
                    'alt' => $title . ' cover',
                    'class' => 'logicvoid-audio-player-cover'
                )
            );
        } else {
            // For external URLs, use wp_get_image_tag function
            $width = 300; // Default width
            $height = 300; // Default height
            $output .= wp_get_image_tag(
                0, // No attachment ID for external images
                $image,
                $title . ' cover',
                'align-none', // CSS class
                array('width' => $width, 'height' => $height)
            );
        }
        $output .= '</div>';
    }
    
    // Content section
    $output .= '<div class="logicvoid-audio-player-content">';
    
    // Info section
    $output .= '<div class="logicvoid-audio-player-info">';
    $output .= '<h3 class="logicvoid-audio-player-title">' . $title . '</h3>';
    $output .= '<p class="logicvoid-audio-description">' . $description . '</p>';
    $output .= '</div>';
    
    // Main controls
    $output .= '<div class="logicvoid-audio-player-controls">';
    $output .= '<button class="logicvoid-audio-play-button" aria-label="Play"><svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="pause-icon" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></button>';
    
    // Time and progress
    $output .= '<div class="logicvoid-audio-progress-container">';
    $output .= '<span class="logicvoid-audio-current-time">00:00</span>';
    $output .= '<div class="logicvoid-audio-progress-bar-container">';
    $output .= '<div class="logicvoid-audio-progress-bar"></div>';
    $output .= '<div class="logicvoid-audio-progress-handle"></div>';
    $output .= '</div>';
    $output .= '<span class="logicvoid-audio-duration">00:00</span>';
    $output .= '</div>';
    
    // Volume and additional controls
    $output .= '<div class="logicvoid-audio-secondary-controls">';
    $output .= '<button class="logicvoid-audio-mute-button" aria-label="Mute"><svg class="volume-icon" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg><svg class="mute-icon" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg></button>';
    $output .= '<div class="logicvoid-audio-volume-control">';
    $output .= '<input type="range" class="logicvoid-audio-volume-slider" min="0" max="1" step="0.05" value="1" aria-label="Volume">';
    $output .= '</div>';
    $output .= '</div>'; // end secondary controls
    
    $output .= '</div>'; // end controls
    $output .= '</div>'; // end content
    $output .= '</div>'; // end container
    
    $output .= '<audio preload="metadata" src="' . $audio_url . '"></audio>';
    $output .= '</div>'; // end wrapper

    // Enqueue the frontend script
    wp_enqueue_script(
        'logicvoid-audio-player-script',
        plugins_url( 'script.js', __FILE__ ),
        array('jquery'),
        filemtime( plugin_dir_path( __FILE__ ) . 'script.js' ),
        true
    );
    
    return $output;
}
