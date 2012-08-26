
window.onloadTimer = setInterval(function(){
  onloadChecker(fileDrapInit);   
    
});

function onloadChecker(callback,param){
  if(window.File&&window.FileList&&window.FileReader){
    clearInterval(window.onloadTimer);
    callback();
  }
}

function fileDrapInit(){
  var selFile = $('#selectFile')[0],
      dragFile = $('#drag')[0],
      smtbtn = $('#imgSubmit')[0],
      imgIndex = -1,
      imgArray = [];

  selFile.addEventListener("change",FileSelectHandler,false);
  smtbtn.addEventListener("click",ImageSubmit,false); 
  var xhr = new XMLHttpRequest();
  if(xhr.upload){
    dragFile.addEventListener("dragover",FileDragHover,false);
    dragFile.addEventListener("dragleave",FileDragHover,false);
    dragFile.addEventListener("drop",FileSelectHandler,false);
    smtbtn.style.display="none";
  }
  function ImageSubmit(e){
    var con = $('.hero-unit'),
        progbar = $('<div class="progress"><div class="bar" id="progressBar" style="width:0%;"></div></div>'),
        waitLabel = $('<h5 id="waitLogo">Waiting</h5>'),
        option ={
          colNum:($('#colNum').val())||40,
          rowNum:($('#rowNum').val())||40,
          blurParam:($('#blur').val())||0.5
        };
    $(con).empty();
    
    $(progbar).appendTo(con);
    $(waitLabel).appendTo(con);
    
    setTimeout(function(){ 
        handleImage(imgArray,option); 
      },100
    );
  }

  function FileSelectHandler(e){
    FileDragHover(e);
    var files = e.target.files||e.dataTransfer.files;
    for(var i = 0,f;f=files[i];i++){
      ParseFile(f);
    }
    smtbtn.style.display="block";
  }
  function FileDragHover(e){
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type=="dragover"?"hover":"");
  }
  function ParseFile(file){
    if(file.type.indexOf('image')==0){
      var reader = new FileReader();
      reader.onload = function(e){
        var img = new Image;
        img.src = e.target.result;
        img.setAttribute('class','thumImg');
        img.setAttribute('id','thumb-'+(imgIndex+=1));
        Output(img,file,imgIndex);
        imgArray.push({empty:false,base:-1,data:e.target.result});
      };
      reader.readAsDataURL(file);
    }
  }
  function Output(msg,file,index){
    var m = $('#message'),
        li = $('<li class="span2"/>'),
        th = $('<div class="thumbnail"/>').appendTo(li),
        ca = $('<div class="caption"/>'),
        p = $('<p/>'),
        l = $('<label class="classbox"/>');
    $('<input id="check-'+index+'" type="checkbox">')
      .bind('click',checkBase)
      .appendTo(l);
    $(l).appendTo(th);
    $(msg).appendTo(th);
    $(ca).appendTo(th);
    $('<a class="btn" id="cancel-'+index+'">cancel</a>')
      .bind('click',removeThis)
      .appendTo(p);
    $(p).appendTo(ca);
    $(li).appendTo(m);
  }
  function removeThis(e){
    var deleteIndex = parseInt(this.getAttribute('id').split('-')[1]);
    imgArray[deleteIndex].empty = true;
    imgArray[deleteIndex].data = null;
    $(this.parentElement.parentElement.parentElement.parentElement).remove();
  }
  function checkBase(e){
    var deleteIndex = this.getAttribute('id').split('-')[1];
    imgArray[deleteIndex].base *= -1 ;
  }
}
