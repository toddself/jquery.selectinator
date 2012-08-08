# jQuery.Selectinator

This plugin allows you to designate a section of your DOM as an object-level
clipboard -- that is defined elements contained as child nodes can be selected
by clicking on them.  When selected they are added to an internal clipboard.

When the user is finished, these items can be returned from the clipboard
and the items themselves pulled from the DOM.

Please see the [demo](http://toddself.github.com/jquery.selectinator/demo.html)
or the [project home](http://toddself.github.com/jquery.selectinator) for more.

## Usage
```html
    <div id="test_div">
        <p>this is a paragraph</p>
        <p>this is another <span><a href="#">asdkfjdf</a>sajdhf<span> paragraph</p>
        <iframe width="420" height="315" src="http://www.youtube.com/embed/PLt2gM52wF8" frameborder="0" allowfullscreen></iframe>
    </div>
```
```javascript
    $('#test_div').selectinate();
    $('#test_div').data('selectinate').getClipboard(); // see what's there
                                      .yankSelections(); // return what's there and pull the elements from the DOM
                                      .clearClipboard(); // clear it all and start over
```