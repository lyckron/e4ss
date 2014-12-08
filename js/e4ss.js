// Remap jQuery to $, and use strict
(function ( $ ) {
    "use strict";

    // Create Easy 4 Social Share - plugin
    $.fn.e4ss = function(options) {

        /* Properties */

        var
            // Plugin default settings
            defaults = {
                // Default values for all platforms
                init     : {
                    root            : 'e4ss/', // Path to plugin root
                    includeCss      : true, // Include plugin css by default
                    includeIcons    : true, // Include font icons by default
                    display         : 'block', // CSS display, params: block, inline
                    align           : 'left', // CSS text-align, params: left, center, right
                    wrapPadding     : '', // Set padding to selector / wrapper div
                    fontSize        : '1em', // 0.8em size allows all four platforms in inline on 320px screens if not more than 1% padding
                    text            : 'share', // uniform text property.. NOTE: if set to "#icon", a share icon will be displayed
                    color           : '', // Set same uniform color - recommend for dark bg #d1d1d1
                    textShadow      : '', // recommend for dark bg : text-shadow: 1px 1px #000000;
                    border          : '', // Set border to all platforms
                    backgroundColor : 'light', // light -, dark theme set by CSS class
                    url             : window.location.href // get current URL to share
                },
                facebook : {
                    include         : true,
                    color           : '#3b5998', // Default Facebook color
                    text            : '',
                    backgroundColor : ''
                },
                twitter  : {
                    include         : true,
                    color           : '#00aced', // Default Twitter color
                    text            : '',
                    backgroundColor : ''
                },
                linkedin : {
                    include         : true,
                    color           : '#007bb6', // Default LinkedIn color
                    text            : '',
                    backgroundColor : ''
                },
                google   : {
                    include         : true,
                    color           : '#d34836', // Default Google+ color
                    text            : '',
                    backgroundColor : ''
                }
            },
            // Settings based on user defined options that overwrite the defaults
            settings = $.extend(true,{}, defaults, options),
            // Plugin stylesheets
            stylesheets = {
                // Plugin CSS classes
                e4ssCss : {
                    include : settings.init.includeCss,
                    path    : settings.init.root + 'css/e4ss.min.css'
                },
                // Font Awesome Icons CSS
                fiveFAIcons : {
                    include : settings.init.includeIcons,
                    path    : settings.init.root + 'five-fa-icons/css/five-fa-icons.min.css'
                }
            },
            // The platforms this plugin supports
            platforms = [
                'facebook',
                'twitter',
                'linkedin',
                'google'
            ],
            // The share URLs that the supported platforms use, based on: http://www.sharelinkgenerator.com/
            shareUrls = {
                facebook : 'https://www.facebook.com/sharer/sharer.php?u=' + settings.init.url,
                twitter  : 'https://twitter.com/home?status=' + settings.init.url,
                linkedin : 'https://www.linkedin.com/shareArticle?mini=true&url=' + settings.init.url + '&title=' + settings.init.url + '&summary=' + settings.init.url + '&source=' + settings.init.url,
                google   : 'https://plus.google.com/share?url=' + settings.init.url
            },
            // Elements that plugin add to selector
            elements = {
                ul : '<ul></ul>',
                li : '<li></li>',
                a  : '<a></a>',
                i  : '<i></i>'
            },
            // Css classes that plugin add to elements
            classes = {
                // Font Awesome icons class names
                icons  : {
                    Share    : 'icon-share',
                    facebook : 'icon-facebook-squared',
                    twitter  : 'icon-twitter-squared',
                    linkedin : 'icon-linkedin-squared',
                    google   : 'icon-gplus-squared'
                }
            };

        /* Methods */

        // Load plugin CSS - IE 9+ compatible.
        function loadCss(path) {
            // checks if document already links to path
            if (!$("link[href='" + path + "']").length) {
                // if not - add link to CSS
                $('<link>')
                    .appendTo('head')
                    .attr({type : 'text/css', rel : 'stylesheet'})
                    .attr('href', path);
            }
        }

        /* Logic */

        // Load css if include is et to true in settings
        $.each(stylesheets, function(stylesheet, value) {
            if (value.include) {
                loadCss(value.path);
            }
        });

        // Delete platforms that settings don't include and set individual platform properties for main return loop
        $.each(platforms, function(index, value){
            if (!settings[value].include) { // Ex: settings.facebook.include
                // If include value is false - delete platform from settings object
                delete settings[value];
                // Skip this platform
                return true;
            }
            // Set text property to default if empty
            if (settings[value].text === '') {
                settings[value].text = settings.init.text;
            }
            // Set platform color to color value if this is not empty
            if (settings.init.color !== '') {
                settings[value].color = settings.init.color;
            }
        });

        /* Main return loop */

        return this.each(function() {
            var
                // Append to selector a ul element with classes and css based on settings, and save reference.
                ul = $(elements.ul).appendTo(this).addClass('e4ss-list e4ss-' + settings.init.display + ' e4ss-' + settings.init.align),
                // Create reference to whether a background color class is added or not.
                bgClass = false;

            // Set padding on wrapper if value is not empty
            if (settings.init.wrapPadding !== '') {
                $(this).css('padding', settings.init.wrapPadding);
            }
            // Only set css font-size if value is not empty. This allows user to set font-size in custom css, to use ex media query's
            if (settings.init.fontSize !== '') {
                ul.css('font-size', settings.init.fontSize);
            }


            // If 'light' or 'dark' found in settings backgroundColor property
            if (['light', 'dark'].indexOf(settings.init.backgroundColor) > -1) {
                // Add matched CSS class to ul element
                ul.addClass('e4ss-bg-' + settings.init.backgroundColor); // Ex: e4ss-bg-dark
                // Set bgClass to true - then no css background-color is added to li elements later
                bgClass = true;
            }
            // Loop through each platform in settings, and build share "buttons" based on init and platform values in settings
            $.each(settings, function(platform, value){
                // Skip init object in settings
                if (platform !== 'init') {
                    var
                        // Create li elements for each included platform, and append to ul element
                        li = $(elements.li).appendTo(ul),
                        // Create a element to append to li elements, and set href to platform share URL, and set text color
                        a  = $(elements.a).appendTo(li).attr('href', shareUrls[platform]).css('color', value.color),
                        // Create i element an add font icon class that macth platform
                        i  = $(elements.i).addClass(classes.icons[platform]);
                    // If no background class is added to ul
                    if (! bgClass) {
                        // Set li element background color
                        if (value.backgroundColor !== '') {
                            // Set to platform value if given
                            li.css('background-color', value.backgroundColor);
                        } else {
                            // Else set to uniform inti value
                            li.css('background-color', settings.init.backgroundColor);
                        }

                    }
                    // If init border value is not empty
                    if (settings.init.border !== '') {
                        // Set li element CSS border to given value
                        li.css('border', settings.init.border);
                    }
                    // If init textShadow value is not empty
                    if (settings.init.textShadow !== '') {
                        // Set a element CSS text-shadow to given value
                        a.css('text-shadow', settings.init.textShadow);
                    }
                    // If platform text value not equal to icon
                    if (value.text !== '#icon') {
                        // Set a element text to given value
                        a.text(value.text);
                    } else {
                        // Else append new i element with share icon class to a element
                        $(elements.i).addClass('icon-share').appendTo(a);
                    }
                    // Prepend i element with platform icon to a element, so this appears before text or icon
                    a.prepend(i);

                } // end if platform

            }); // end each

        }); // end return

    }; // end plugin fn

}( jQuery )); // end $ and use strict fn