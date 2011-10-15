Responsive.js
=============

Responsive.js aids you achieve responsive web design, allowing you to set callbacks between different screen resolutions.

Set functions to execute whenever the window  size enters/exits a given range.

For example, you could move the main navigation to the bottom when the screen gets too small.

Example Usage
=============
```javascript
$.responsive()
  .from(0,500)
    .enter(function(){
      //execute code when the window size is between 0 and 500
    })
    .enter(function(){
      //execute more code when the window size is between 0 and 500
    })
  .from(500,720)
    .enter(function(){
      //execute code when the window size is between 500 and 720
    })
    .exit(function(){
      //execute code when the window size exits this range (ej. screens bigger than 500)
    })
```

Methods
=======


<ul>
<li><strong>$.responsive()</strong><br/>
Initialize plugin</li>
  
<li><strong>$.responsive().from(from,to,key)</strong><br/>
  Sets a range<br/>
    <ul>
      <li>from: min width</li>
      <li>to: max width</li>
      <li>key: range name</li>
    </ul>
</li>

<li><strong>$.responsive().from(from,to).enters(callback)</strong>
<br/>Sets a callback to execute when the screen size enters the given range</li>
    
<li><strong>$.responsive().from(from,to).exits(callback)</strong><br/>
Sets a callback to execute when the screen size enters the given range</li>

<li><strong>$.responsive().start()</strong>
<br/>Starts plugin</li>  
<li><strong>$.responsive().stop()</strong>
<br/>Stop plugin</li>
</ul>