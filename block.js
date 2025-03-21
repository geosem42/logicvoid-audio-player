(function (blocks, editor, components, i18n, element) {
  var el = element.createElement;
  var __ = i18n.__;
  var MediaUpload = editor.MediaUpload;
  var InspectorControls = editor.InspectorControls;
  var BlockControls = editor.BlockControls;
  var PanelColorSettings = editor.PanelColorSettings;
  var RichText = editor.RichText;
  var Button = components.Button;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var TextareaControl = components.TextareaControl;

  /**
 * Check if a color value is a valid hex color
 * @param {string} color The color to validate
 * @return {boolean} Whether the color is valid
 */
function isValidHexColor(color) {
  return color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

  blocks.registerBlockType("logicvoid-audio-player/player", {
    title: __("LogicVoid Audio Player"),
    icon: "format-audio",
    category: "media",

    // Define the editing interface
    edit: function (props) {
      var attributes = props.attributes;

      // Generate a unique ID for this instance if not already set
      if (!attributes.blockID) {
        props.setAttributes({
          blockID:
            "logicvoid-audio-player-" + Math.random().toString(36).substr(2, 9),
        });
      }

      // Function to handle audio file selection
      function onSelectAudio(media) {
        props.setAttributes({
          audioID: media.id,
          audioURL: media.url,
          title: media.title || attributes.title,
        });
      }

      // Function to handle image selection
      function onSelectImage(media) {
        props.setAttributes({
          imageID: media.id,
          imageURL: media.url,
        });
      }

      // Render block edit UI
      return [
        // Inspector Controls (sidebar)
        el(
          InspectorControls,
          { key: "inspector" },
          el(
            PanelBody,
            { title: __("Audio File"), initialOpen: true },
            el(MediaUpload, {
              onSelect: onSelectAudio,
              allowedTypes: ["audio"],
              value: attributes.audioID,
              render: function (obj) {
                return el(
                  Button,
                  {
                    className: "components-button is-button is-default is-large",
                    onClick: obj.open,
                  },
                  attributes.audioURL ? __("Replace Audio File") : __("Select Audio File")
                );
              },
            }),
        
            attributes.audioURL &&
              el(
                "div",
                { className: "logicvoid-audio-filename" },
                el(
                  "p",
                  {},
                  __("Selected audio: ") + attributes.audioURL.split("/").pop()
                )
              )
          ),
          // Content settings
          el(
            PanelBody,
            { title: __("Content Settings"), initialOpen: true },
            el(TextControl, {
              label: __("Title"),
              value: attributes.title,
              onChange: function (value) {
                props.setAttributes({ title: value });
              },
            }),
            
            el(TextareaControl, {
              label: __("Description"),
              value: attributes.description,
              onChange: function (value) {
                props.setAttributes({ description: value });
              },
            })
          ),
          // Image settings
          el(
            PanelBody,
            { title: __("Image Settings"), initialOpen: true },
            el(MediaUpload, {
              onSelect: onSelectImage,
              allowedTypes: ["image"],
              value: attributes.imageID,
              render: function (obj) {
                return el(
                  Button,
                  {
                    className:
                      "components-button is-button is-default is-large",
                    onClick: obj.open,
                  },
                  attributes.imageURL
                    ? __("Replace Image")
                    : __("Select Cover Image")
                );
              },
            }),

            attributes.imageURL &&
              el(
                "div",
                { className: "editor-post-featured-image" },
                el("img", { src: attributes.imageURL, alt: __("Cover image") })
              ),

            attributes.imageURL &&
              el(
                Button,
                {
                  className: "components-button is-link is-destructive",
                  onClick: function () {
                    props.setAttributes({
                      imageID: null,
                      imageURL: "",
                    });
                  },
                },
                __("Remove Cover Image")
              )
          ),
          // Color settings
          el(
            PanelBody,
            { title: __("Color Settings"), initialOpen: false },
            el(
              "div",
              { className: "logicvoid-color-settings" },
              el(
                "p",
                { className: "components-base-control__label" },
                __("Accent Color (Buttons, Progress)")
              ),
              el(wp.components.ColorPalette, {
                value: attributes.accentColor,
                onChange: function (color) {
                  if (color === undefined || isValidHexColor(color)) {
                    props.setAttributes({ accentColor: color || '#58a6ff' });
                  }
                },
              }),

              el(
                "p",
                { className: "components-base-control__label" },
                __("Background Color")
              ),
              el(wp.components.ColorPalette, {
                value: attributes.backgroundColor,
                onChange: function (color) {
                  props.setAttributes({ backgroundColor: color || "#0d1117" });
                },
              }),

              el(
                "p",
                { className: "components-base-control__label" },
                __("Primary Text Color")
              ),
              el(wp.components.ColorPalette, {
                value: attributes.textPrimaryColor,
                onChange: function (color) {
                  props.setAttributes({ textPrimaryColor: color || "#f0f6fc" });
                },
              }),

              el(
                "p",
                { className: "components-base-control__label" },
                __("Secondary Text Color")
              ),
              el(wp.components.ColorPalette, {
                value: attributes.textSecondaryColor,
                onChange: function (color) {
                  props.setAttributes({
                    textSecondaryColor: color || "#8b949e",
                  });
                },
              }),

              el(
                "p",
                { className: "components-base-control__label" },
                __("Control Background Color")
              ),
              el(wp.components.ColorPalette, {
                value: attributes.controlBgColor,
                onChange: function (color) {
                  props.setAttributes({ controlBgColor: color || "#21262d" });
                },
              }),

              el(
                "p",
                { className: "components-base-control__label" },
                __("Progress Bar Background")
              ),
              el(wp.components.ColorPalette, {
                value: attributes.progressBgColor,
                onChange: function (color) {
                  props.setAttributes({ progressBgColor: color || "#30363d" });
                },
              }),

              el(
                "p",
                { className: "components-base-control__label" },
                __("Border Color")
              ),
              el(wp.components.ColorPalette, {
                value: attributes.borderColor,
                onChange: function (color) {
                  props.setAttributes({ borderColor: color || "#30363d" });
                },
              }),

              el(
                "div",
                { className: "logicvoid-color-reset" },
                el(
                  Button,
                  {
                    isSecondary: true,
                    onClick: function () {
                      props.setAttributes({
                        accentColor: "#58a6ff",
                        backgroundColor: "#0d1117",
                        textPrimaryColor: "#f0f6fc",
                        textSecondaryColor: "#8b949e",
                        controlBgColor: "#21262d",
                        progressBgColor: "#30363d",
                        borderColor: "#30363d",
                      });
                    },
                  },
                  __("Reset to Default Colors")
                )
              )
            )
          ),
        ),

        // Block preview
        el(
          "div",
          { className: props.className },
          !attributes.audioURL
            ? el(
                "div",
                { className: "components-placeholder" },
                el(
                  "div",
                  { className: "components-placeholder__label" },
                  __("LogicVoid Audio Player")
                ),
                el(
                  "div",
                  { className: "components-placeholder__instructions" },
                  __("Select an audio file to create a player")
                ),
                el(MediaUpload, {
                  onSelect: onSelectAudio,
                  allowedTypes: ["audio"],
                  render: function (obj) {
                    return el(
                      Button,
                      {
                        className: "components-button is-button is-primary",
                        onClick: obj.open,
                      },
                      __("Select Audio File")
                    );
                  },
                })
              )
            : el(
                "div",
                {
                  className: "logicvoid-audio-player-wrapper editor-preview",
                  style: {
                    '--player-accent-color': attributes.accentColor || '#58a6ff',
                    '--player-background': attributes.backgroundColor || '#0d1117',
                    '--player-text-primary': attributes.textPrimaryColor || '#f0f6fc',
                    '--player-text-secondary': attributes.textSecondaryColor || '#8b949e',
                    '--player-control-bg': attributes.controlBgColor || '#21262d',
                    '--player-progress-bg': attributes.progressBgColor || '#30363d',
                    '--player-border-color': attributes.borderColor || '#30363d',
                  },
                },
                el(
                  "div",
                  { className: "logicvoid-audio-player-container" },
                  // Image section (if provided)
                  attributes.imageURL &&
                    el(
                      "div",
                      { className: "logicvoid-audio-player-image" },
                      el("img", {
                        src: attributes.imageURL,
                        alt: attributes.title + " cover",
                      })
                    ),

                  // Content section
                  el(
                    "div",
                    { className: "logicvoid-audio-player-content" },
                    // Info section
                    el(
                      "div",
                      { className: "logicvoid-audio-player-info" },
                      el(RichText, {
                        tagName: "h3",
                        className: "logicvoid-audio-player-title",
                        value: attributes.title,
                        onChange: function (value) {
                          props.setAttributes({ title: value });
                        },
                        placeholder: __("Enter title"),
                      }),
                      el(RichText, {
                        tagName: "p",
                        className: "logicvoid-audio-description",
                        value: attributes.description,
                        onChange: function (value) {
                          props.setAttributes({ description: value });
                        },
                        placeholder: __("Enter description"),
                      })
                    ),

                    // Controls preview (static in editor)
                    el(
                      "div",
                      { className: "logicvoid-audio-player-controls" },
                      el(
                        "button",
                        {
                          className: "logicvoid-audio-play-button",
                          disabled: true,
                        },
                        el(
                          "svg",
                          { className: "play-icon", viewBox: "0 0 24 24" },
                          el("path", { d: "M8 5v14l11-7z" })
                        )
                      ),

                      el(
                        "div",
                        { className: "logicvoid-audio-progress-container" },
                        el(
                          "span",
                          { className: "logicvoid-audio-current-time" },
                          "00:00"
                        ),
                        el(
                          "div",
                          {
                            className: "logicvoid-audio-progress-bar-container",
                          },
                          el("div", {
                            className: "logicvoid-audio-progress-bar",
                          }),
                          el("div", {
                            className: "logicvoid-audio-progress-handle",
                          })
                        ),
                        el(
                          "span",
                          { className: "logicvoid-audio-duration" },
                          "00:00"
                        )
                      ),

                      el(
                        "div",
                        { className: "logicvoid-audio-secondary-controls" },
                        el(
                          "button",
                          {
                            className: "logicvoid-audio-mute-button",
                            disabled: true,
                          },
                          el(
                            "svg",
                            { className: "volume-icon", viewBox: "0 0 24 24" },
                            el("path", {
                              d: "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
                            })
                          )
                        ),
                        el(
                          "div",
                          { className: "logicvoid-audio-volume-control" },
                          el("input", {
                            type: "range",
                            className: "logicvoid-audio-volume-slider",
                            min: "0",
                            max: "1",
                            step: "0.05",
                            value: "1",
                            disabled: true,
                          })
                        )
                      )
                    )
                  )
                ),

                // Show audio file name in editor
                el(
                  "div",
                  { className: "logicvoid-audio-editor-filename" },
                  el(
                    "small",
                    {},
                    __("Audio: ") + attributes.audioURL.split("/").pop()
                  )
                )
              )
        ),
      ];
    },

    // Define the saved output
    save: function (props) {
      // Using Dynamic Block - render_callback will handle the frontend display
      return null;
    },
  });
})(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.components,
  window.wp.i18n,
  window.wp.element
);
