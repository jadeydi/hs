import React from 'react';
import MediumEditor from 'medium-editor';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/beagle.css';
import client from '../network/httpclient';

function handleDrop(e) {
  //kill any default behavior
  e.stopPropagation();
  e.preventDefault();
  //get x and y coordinates of the dropped item
  var x = e.clientX,
    y = e.clientY;

  var fileList = e.dataTransfer.files;
  for (var i = 0; i < fileList.length; i++) {
    var file = e.dataTransfer.files[i];
    //don't try to mess with non-image files
    if (file.type.match('image.*')) {
      //we have a file handle, need to read it with file reader!
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(readerEvt) {
        //get the data uri
          var binaryString = readerEvt.target.result;
          var data = {};
          data.data = binaryString;

        //make a new image element with the data as the source
        var img = document.createElement("img");
        var name = Math.random().toString(32).substring(5) + i;
        img.className = name;
        img.style.cssText = 'max-width: 320px; max-height: 270px;';
        img.src = URL.createObjectURL(file);

        client('/attachments', 'POST', data).done(function(result) {
          img.src = result.path + '?imageView2/2/w/720/h/480';
          img.className = 'content-image'
          img.style.cssText = ''
        });

        //Insert the image at the carat

        // Try the standards-based way first. This works in FF
        if (document.caretPositionFromPoint) {
          var pos = document.caretPositionFromPoint(x, y),
            range = document.createRange();
          range.setStart(pos.offsetNode, pos.offset);
          range.collapse();
          range.insertNode(img);
        } else if (document.caretRangeFromPoint) {
          // Next, the WebKit way. This works in Chrome.
          var range = document.caretRangeFromPoint(x, y);
          range.insertNode(img);
        } else {
          //not supporting IE right now.
          console.log('could not find carat');
        }
      });
      //this reads in the file, and the onload event triggers, which adds the image to the div at the carat
      reader.readAsDataURL(file);
    }
  }
}

const RichEditor = React.createClass({
  componentDidMount() {
    var editor = new MediumEditor('.text-editor', {
      placeholder: {
        text: '',
      },
      autoLink: true,
      imageDragging: false,
    });
    var dropZone = document.getElementById('js-editor');
    dropZone.addEventListener('drop', handleDrop, false);
  },

  componentWillReceiveProps(nextProps) {
    $('.text-editor').html(nextProps.value);
  },

  render() {
    return (
      <div className="text-editor" id="js-editor"> </div>
    )
  }
});

module.exports = {richEditor: RichEditor};
