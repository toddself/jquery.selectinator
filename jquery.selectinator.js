// jQuery.selectinator.js
//
// Copyright (C) 2012 Broadcastr
// Author: Todd Kennedy <todd@broadcastr.com>
// Distributed under MIT License
//
// Documentation and full license available at:
// http://toddself.github.com/jquery.selectinator

// options - elements: array, wrapMedia: boolean, mediaHelpText: string, mediaSelectorClass: string, selectedElementClass: string

(function($){
    $.fn.selectinate = function(options){
        var elem_list = grabStrings(options.tags);
        var $parent = $(this);
        $parent.data('selectinator', new $.Selectinator($parent, elem_list));
    }

    var grabStrings = function(arr){
        var list = [];
        $.each(arr, function(a){
            if(typeof a === 'string'){
                list.push(a);
            }
        });
        return list;
    }

    $.Selectinator = function($parent, elem_list){
        // store a reference to yourself
        var self = this;
        var this.$parent = $parent;

        // the "clipboard" is where the elements you're pulling out of the DOM
        // are stored for retrival
        var this.clipboard = [];

        // attach DOM handlers.  Rather than attaching multiple click events,
        // one for each child element of $parent, we're going to attach the
        // click listener to the $parent element, and have it only call the
        // toggleSelected method when a specific element type is selected.
        $.each(elem_list, function(elem){
            this.$parent.on('click', elem, self.toggleSelected);
        });

        // this will wrap all the media objects in the page so that they're
        // eaiser to select.  since this does some funny DOM manipulation, you
        // shouldn't ever use this within the context of an RTE or you might
        // have a bad time...
        self.wrapMedia();
    }

    $.Selectinator.prototype.wrapMedia = function(){
        // we want to wrap media objects in special div tags that allow the iframe
        // to be selected.  media objects = <object>, <iframe>, <embed>
        var mediaWrapper = $(document.createElement('div')).addClass('sl-media');
        var mediaHintText = "Click here to select this media object";
        mediaWrapper.html(mediaHintText).append($(document.createElement('br')));

        // save a reference for easier access
        var self = this;

        // for each media tag...
        $.each(['object', 'embed', 'iframe'], function(mediaTagName){
            $(mediaTagName, $parent).each(function(mediaTag){
                var mediaObj = $(mediaTag).clone();
                var localWrapper = mediaWrapper.clone();
                $(mediaTag).replaceWith(localWrapper.append(mediaObj));
                self.$parent.on('click', localWrapper, self.toggleSelected);
            });
        });
    };


    $.Selectinator.prototype.toggleSelected = function(event){
        $target = $(event.currentTarget);
        var position;

        if($target.hasClass('sl-selected')){
            position = $target.data('sl-position');
            $target.removeClass('sl-selected');
            $target.removeData('sl-position');
            this.clipboard[position] = null;
        } else {
            this.clipboard.push($target);
            var position = this.clipboard.length;
            $target.data('sl-position', position).addClass('sl-selected');
        }
    };

    $.Selectinator.prototype.yankSelections = function(){};

    $.Selectinator.prototype.readClipboard = function(){};

    $.Selectinator.prototype.clearClipboard = function(){};

    $.Selectinator.prototype.removeAllHandlers = function(){};

    $.Selectinator.prototype.addElementHandler = function(){}:

    $.Selectinator.prototype.removeElementHandler = function(){};

})(jQuery);