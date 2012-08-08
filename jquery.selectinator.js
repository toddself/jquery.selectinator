// jQuery.selectinator.js
//
// Copyright (C) 2012 Broadcastr
// Author: Todd Kennedy <todd@broadcastr.com>
// Distributed under MIT License
//
// Documentation and full license available at:
// http://toddself.github.com/jquery.selectinator

(function($){
    // here are the defaults that can be overridden
    var defaults = {elements: ['p', 'img'],
                    mediaElements: ['object', 'iframe', 'embed', 'video', 'audio'],
                    wrapMedia: true,
                    mediaHelpString: 'Click here to select this media object',
                    mediaWrapperClass: 'sl-media',
                    selectedElementClass: 'sl-selected',
                    positionDataAttribute: 'sl-position',
                    preventDefaultAction: true,
                    preventDefaultLinkAction: true};

    // the plugin
    $.fn.selectinate = function(options){
        // if you're not passing in an object, we'll make it one...
        options === Object(options) ? true : options = {};
        options = $.extend({}, defaults, options);

        // we'll attach the instantiated object to the data attribute
        // of the element on which you've invoked this plugin.  this means
        // you can access the methods on the plugin via:
        // $('#element').data('selectinator').yankSelections();
        var $parent = $(this);
        $parent.data('selectinator', new $.Selectinator($parent, options));
    };

    // the actual work happens here
    $.Selectinator = function($parent, options){
        // store a reference to yourself
        var self = this;
        // store the parent element
        this.$parent = $parent;

        // the "clipboard" is where the elements you're pulling out of the DOM
        // are stored for retrival
        this.clipboard = [];

        this.options = options;

        // this will wrap all the media objects in the page so that they're
        // eaiser to select.  since this does some funny DOM manipulation, you
        // shouldn't ever use this within the context of an RTE or you might
        // have a bad time...
        this.wrapMedia();

        // attach DOM handlers.  Rather than attaching multiple click events,
        // one for each child element of $parent, we're going to attach the
        // click listener to the $parent element, and have it only call the
        // toggleSelected method when a specific element type is selected.
        // We also filter out all the media elements here just in case someone
        // has passed them in.
        $.each(this.options.elements, function(index, elem){
            if(self.options.mediaElements.indexOf(elem) === -1){
                // don't forget to pass the current context to the method
                self.$parent.on('click', elem, $.proxy(self.toggleSelectedElement, self));
            }
        });
    }

    $.Selectinator.prototype.wrapMedia = function(){
        // we want to wrap media objects in special div tags that allow the iframe
        // to be selected.  media objects are defined in options.mediaElements
        var mediaWrapper = $(document.createElement('p'))
                                .addClass(this.options.mediaWrapperClass);
        mediaWrapper.html(this.options.mediaHelpString)
                    .append($(document.createElement('br'))
                        .css('clear', 'both'));

        // save a reference for easier access
        var self = this;

        // for each media tag...
        $.each(this.options.mediaElements, function(index, mediaTagName){
            $(mediaTagName, self.$parent).each(function(innerIndex, mediaTag){
                var mediaObj = $(mediaTag).clone();
                var localWrapper = mediaWrapper.clone();
                $(mediaTag).replaceWith(localWrapper.append(mediaObj));
                // don't forget to pass the current context to the method
                // self.$parent.on('click', localWrapper.get(0), $.proxy(self.toggleSelectedMedia, self));
            });
        });
    };

    $.Selectinator.prototype.toggleSelectedMedia = function(event){
        // this works almost exactly the same as the toggleSelected method
        // only it copies the last child element of the $parent node to the
        // clipboard, since the media objects are wrapped in a helper div
        // but applies the data and class information to $parent.
        $target = $(event.currentTarget);
        event.preventDefault();

        if($target.hasClass(this.options.selectedElementClass)){
            this.removeDataFromClipboard($target);
        } else {
            var num_children = $target.children().length
            this.addDataToClipboard($target, $target.children()[num_children-1])
        }
    };

    $.Selectinator.prototype.toggleSelectedElement = function(event){
        // event.currentTarget is the element on which we proxied the handler
        $target = $(event.currentTarget);
        if((event.target.nodeName === 'A' && this.options.preventDefaultLinkAction)
          || (this.options.preventDefaultAction)){
            event.preventDefault();
        }

        if($target.hasClass(this.options.selectedElementClass)){
            this.removeDataFromClipboard($target);
        } else {
            this.addDataToClipboard($target);
        }
    };

    // removes the class, the data attribute and the object from the clipboard list
    $.Selectinator.prototype.removeDataFromClipboard = function($target){
            $target.removeClass(this.options.selectedElementClass);
            var position = $target.data(this.options.positionDataAttribute);
            this.clipboard.splice(position, 1);
            $target.removeData('sl-position');
    };

    $.Selectinator.prototype.addDataToClipboard = function($target, element){
        if(typeof element === 'undefined'){
            element = $target.get(0);
        }
        this.clipboard.push(element);
        $target.data(this.options.positionDataAttribute, this.clipboard.length-1)
               .addClass(this.options.selectedElementClass);
    };

    $.Selectinator.prototype.yankSelections = function(){
        $('.'+this.options.selectedElementClass).detach();
        var clipboard = this.clipboard;
        this.clipboard = [];
        return clipboard;
    };

    $.Selectinator.prototype.getClipboard = function(){
        return this.clipboard;
    };

    $.Selectinator.prototype.clearClipboard = function(){
        $('.'+this.options.selectedElementClass).each(function(el){
            $(el).removeData('sl-position')
                 .removeClass(this.options.selectedElementClass);
        });
        this.clipboard = [];
    };

    $.Selectinator.prototype.removeAllHandlers = function(){};

    $.Selectinator.prototype.addElementHandler = function(){};

    $.Selectinator.prototype.removeElementHandler = function(){};

})(jQuery);