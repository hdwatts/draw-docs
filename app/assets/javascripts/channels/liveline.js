//= require cable
//= require_self
//= require_tree .

this.App = {};

App.cable = ActionCable.createConsumer();

App.messages = App.cable.subscriptions.create('LineChannel', {
  received: function(data) {
    drawLine(data.fromx, data.fromy, data.tox, data.toy, data.color)
  }
});

$(function(){
    doc = $(document),
    win = $(window),
    canvas = $('#paper'),
    ctx = canvas[0].getContext('2d'),
    instructions = $('#instructions');

  var prev = {};
  var color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  var drawing = false;

  canvas.on("mousedown touchstart", function(e){
    e.preventDefault();
    if ( e.changedTouches ) {
      e = e.changedTouches[0];
    }
    drawing = true;
    prev.x = e.pageX;
    prev.y = e.pageY;
    instructions.fadeOut(1000)
  })

  doc.bind('mouseup mouseleave touchend',function(){
    drawing = false;
  });

  var lastEmit = $.now();

  doc.on('mousemove touchmove',function(e){
    if(drawing && $.now() - lastEmit > 10){
      if ( e.changedTouches ) {
        e = e.changedTouches[0];
      }

      $.ajax({
        method: "POST",
        url: "/updateline",
        data: {
          'fromx': prev.x,
          'fromy': prev.y,
          'tox': e.pageX,
          'toy': e.pageY,
          'color': color
        }
      });
      lastEmit = $.now();
    }

    // Draw a line for the current user's movement, as it is
    // not received in the socket.on('moving') event above

    if(drawing){

      drawLine(prev.x, prev.y, e.pageX, e.pageY, color);

      prev.x = e.pageX;
      prev.y = e.pageY;
    }
  });

});
function drawLine(fromx, fromy, tox, toy, color){
  ctx.beginPath();
  ctx.strokeStyle = color
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.stroke();
}
