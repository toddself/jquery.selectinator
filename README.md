# jQuery.Selectinator

The purpose of this plug-in is to allow people to select aribitrary elements
within the DOM, and pull them out of the DOM, returning them in the selection
order.

Allows you to select entire paragraphs, images, media elements, etc by just
clicking on them. Allows you to prevent the default actions from occuring as well
while the plug-in is active.

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
    $('#test_div').data('selectinate').readClipboard(); // see what's there
                                      .yankSelections(); // return what's there and pull the elements from the DOM
                                      .clearClipboard(); // clear it all and start over
```