(function($,window,document,undefined){

  function Responsive(){
    this.ranges = {};
    this.resizes = [];    
    this.window = $(window);
  }
  
  (r = Responsive.prototype).from = function($from, $to){
    this.current_index_from = this.ranges[$from] || (this.ranges[$from] = {enters:[],exits:[]});
    this.current_index_to =  this.ranges[$to] || ( this.ranges[$to] = {enters:[],exits:[]});
    return this;
  }
  
  // 820------1024------1240
  
  r.exit = function(callback){
    this.current_index_to.exits.push(callback);
    return this;
  }
  
  r.enter = function(callback){
    this.current_index_from.enters.push(callback);
    return this;
  }
  
  r.window = function(callback){
    this.resizes.push(callback);
    return this;
  }
  
  r.start = function(options){
    var min = 0, max = -1, r,
      width = this.window.bind("resize",this,on_resize).width(), sorted_ranges = [], ranges_length;
    for (var resolution in this.ranges)
      sorted_ranges.push(Number(resolution))
    ranges_length = sorted_ranges.length
    this.sorted_ranges = sorted_ranges.sort(function(a,b){return a > b})
    
    for(var i = ranges_length - 1; i >= 0; i--){
      var current = sorted_ranges[i], prev = sorted_ranges[i-1];
      if(current > width && prev < width){
        this.next = sorted_ranges[(this.next_index = i)]
        this.current = sorted_ranges[(this.current_index = i-1)];
        this.prev_index = i-2 < 0 ? null : i-2; 
        this.prev = this.prev_index == null ? null : sorted_ranges[this.prev_index];
        break;
      }else if(current < width){
        this.next_index = null; this.next = null;
        this.current_index = i; this.current = sorted_ranges[i];
        this.prev_index = i-1; this.prev = this.range_at(i-1);
        break;
      }
    }

    //if(!this.next_index){
    //  this.execute(this.current_index,"exits")
    //}else if(prev){
    //  this.execute(this.current_index,"enters")
    //}
    
    return this;
  }
  
  r.stop = function(){
    
  }
  
  r.execute = function(index,action){
    if(!index) return;
    var callbacks = this.range_at(index)[action];
    for(var method in callbacks){
      callbacks[method]();
    }
  }
  
  r.range_at = function(index){
    return this.ranges[this.sorted_ranges[index]];
  }
  
  r.respond = function(action){
    switch(action){
      case "next":
        var next_index = this.next_index;
        this.step_next(["current","prev","next"]);
        this.execute(next_index,"enters");
        this.execute(this.current_index,"exits");
        break;
      case "prev":
        this.execute(this.prev_index,"enters");
        this.execute(this.next_index,"exits");
        this.step_prev(["current","prev","next"])
        break;
    }
  }
  
  r.step_prev = function(attrs){
    for(var prop in attrs){
      prop = attrs[prop]
      var val = this[prop+"_index"];
      var index = this[prop+"_index"] = val - 1 < 0 ? null : val-1
      this[prop] = index ? this.sorted_ranges[index] : null
    }
    
  }
  
  r.step_next = function(attrs){
    var l = this.sorted_ranges.length;
    for(var prop in attrs){
      prop = attrs[prop]
      var val = this[prop+"_index"];
      var index = this[prop+"_index"] = val + 1 >= l ? null : val+1
      this[prop] = index ? this.sorted_ranges[index] : null
    }
  }
  
  function on_resize(event){
    var responsive = event.data, width = responsive.window.width();
    if(width < responsive.current){
      if(width > responsive.prev){
        responsive.respond("prev")
      }
    }else if(responsive.next && width > responsive.next){
      console.log("next")
      responsive.respond("next")
    }else{console.log(responsive.next,responsive.current,width)}
  }
  
  $.responsive = new Responsive();

})(jQuery,window,document)