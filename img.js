function handleImage(data,option){
   
  var progressIndex = 0,
      progress = $('#progressBar'),
      srcPercent = option.blurParam,
      unitNumW = option.colNum,
      unitNumH = option.rowNum,
      resultURL = null,
      resultPNG = new Image(),
      resultCanvas = null;

  function addProgress(){
    progressIndex+=10;
      $(progress).css({
        width:progressIndex+'%'
      });
    if(progressIndex==100){
      setTimeout(showConfirmBtn,200);
    }
  }
  addProgress();


  var baseImg = function(){
    var re = null;
    for (var i in data){
      var tmp = data[i];
      if((tmp.base==1)&&(tmp.empty==false)){
        re = data[i];
      }else if(tmp.empty==true){
        data.splice(i,1);
      }
      addProgress();
    }
    return re;
  }();

  initCanvas(data);
  function showConfirmBtn(){
    var bt = $('#waitLogo')
        .addClass('btn btn-success')
        .text('Show');
    $(bt).bind('click',showImage);
  }
  function showImage(){
    $(bt).unbind('click',showImage);

    var bt = $('#waitLogo')
        .text('Download');
    $(bt).bind('click',downloadImage);

    $('#result').fadeIn('slow');

  }
  function downloadImage(){
    var ooo = resultCanvas.toDataURL();

    var txt = '<div id="alertImgDown"></div>';
    $.prompt(txt,{
      callback:downloadThisImage,
      buttons:{Ok:'Download'}
    });
    $(resultPNG).appendTo('#alertImgDown');
      
      function downloadThisImage(){
        location = ooo.replace(/image\/.*;/, 'image/octet-stream;');
      }
  }
  function initCanvas(imgs){
    var Contain = $('<div id="result" class="span12"></div>')
          .css({
            'margin-left':0
          })
          .appendTo('.row-fluid'),
        canvasPa = document.createElement('canvas'),
        ctxPa = canvasPa.getContext('2d')
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    addProgress();
    var base = new Image;
    base.src= baseImg.data; 
    
    var containWidth = $('#result').width(),
        containHeight = $('#result').height(),
        baseRatio = base.width/base.height,
        wofcontain = base.width,
        hofcontain = base.height,
        canvasContain = $('<div/>')
          .css({
            width:containWidth + 'px',
            height:containWidth/baseRatio + 'px'
          })
          .appendTo(Contain);
      
    $('#result').hide();
    
    canvas.setAttribute('id','canvas');
    canvas.setAttribute('width',wofcontain+'px');
    canvas.setAttribute('height',hofcontain+'px');
    canvasPa.setAttribute('width',wofcontain+'px');
    canvasPa.setAttribute('height',hofcontain+'px');

    loadBaseImg(base);
    addProgress();
    function loadBaseImg(bkp){
      addProgress();
      ctx.drawImage(bkp,0,0,wofcontain,hofcontain);
      var b = ctx.getImageData(0,0,wofcontain,hofcontain),
          c = comapreImg(b,combineImg(imgs));
      ctx.putImageData(c,0,0);
      resultURL = canvas.toDataURL('image/png');
      resultPNG.src = resultURL;
      $(resultPNG)
        .css({
          width:containWidth+'px',
          height:containWidth/baseRatio+'px'
        })
        .appendTo(canvasContain);
      resultCanvas = canvas;
    }
    function comapreImg(o,d){
      var result = o.data,
          comp = d.data;
      for(var i = 0;i<result.length;i+=1){
        result[i] = result[i]*srcPercent+comp[i]*(1-srcPercent);
      }
      addProgress();
      return o;
    }
    function combineImg(images){
      addProgress();
      var num = images.length,
          w = wofcontain/unitNumW,
          h = hofcontain/unitNumH,
          position = new Position(w,h,wofcontain,hofcontain,0,0),
          ran = -1,
          dataArray = [],
          tempCanvas = document.createElement('canvas'),
          tempCtx = tempCanvas.getContext('2d');
      for(var m =0;m<num;m++){
        var im = new Image;
        im.src = images[m].data;
        tempCtx.drawImage(im,0,0,w,h);
        dataArray.push(tempCtx.getImageData(0,0,w,h));
      }

      addProgress();
      for(var k =0;k<unitNumW*(unitNumH);k+=1){
        var posi = position.add(),
            ran = Math.floor(Math.random()*num);
        ctxPa.globalAlpha = 0.55;
        ctxPa.putImageData(dataArray[ran],posi.sx,posi.sy);

      }
      addProgress();
      return ctxPa.getImageData(0,0,wofcontain,hofcontain);

      function Position(unitw,unith,mw,mh,initw,inith){
        var i = j = 0,
            uw = unitw,
            uh = unith,
            maxw = mw,
            maxh = mh,
            iw = initw,
            ih = inith;

        this.add = function(){
          var sx = i*uw,
              sy = j*uh;
          
          i+=1;
          if((sx+1*uw)>=maxw){
            i=0;
            j+=1;
          }
          return {
            sx:sx,
            sy:sy,
            ex:sx+uw,
            ey:sy+uh
          };
        };

      }
    }

  }
  addProgress();
  console.log(data);
}
