(function($,window,document,undefined){
  
  var _r , _range;
  
  function Responsive(){
    this.ranges = new Ranges();
    this.engine = new ResponsiveEngine();    
  }
  
  Responsive.STATES = {
    ENTERS:"enters",
    EXITS:"exits"
  }
  
  function ResponsiveEngine(){
    var window_width = 0, self = this, ranges, sorted_ranges, ranges_length,
      next, prev, current;
    
    this.start = function($ranges,$window){
      window = $($window);
      window_width = window.width();
      ranges = $ranges;
      sorted_ranges = ranges.sort();
      ranges_length = sorted_ranges.length;
      
      current = this.get_current();
      this.set_current_state();
      
      window.bind("resize", this.on_resize);
    }
    
    this.stop = function(){
      window.unbind("resize", this.on_resize)
    }
    
    this.set_current_state = function(){
      if(!current){
        if(ranges.min > window_width){
          ranges.before_first();
          (next = ranges.get_next()).exits(window_width);
        }else{
          ranges.after_last();
          (prev = ranges.get_prev()).exits(window_width);
        }
      }else{
        next = ranges.get_next(); if(next) next.exits(window_width);
        prev = ranges.get_prev(); current.enters(window_width);
      }
    }
    
    this.get_current = function(){
      return ranges.next_until(function(current){
        return current.from < window_width && current.to > window_width
      })
    }
    
    this.on_resize = function(event){
      window_width = window.width(); var p;
      if(!current){
        if((p = prev && prev.to > window_width) || (next && next.from < window_width)){
          ranges[p ? "prev" : "next"]()
          set_indexes();
          current.enters(window_width);
        }
      }else{
        var oversize = window_width > ranges.max, undersize = window_width < ranges.min;
        if(!undersize && window_width < current.from){
          current.exits(window_width);
          ranges.prev();
          set_indexes();
          if(current) current.enters(window_width);
        }else if(!oversize && window_width > current.to){
          current.exits(window_width);
          next.enters(window_width);
          ranges.next();
          set_indexes()
        }else if((p = oversize) || (undersize)){
          current.exits(window_width);
          ranges[p ? "next" : "prev"]();
          set_indexes();
        }
      }
    }
    
    function set_indexes(){
      current = ranges.current(); next = ranges.get_next(); prev = ranges.get_prev();
    }
    
  }
  
  function Ranges(){
    var current_range, ranges = [], index = 0, total_ranges = 0;
    
    this.from = function(from,to,key){
      if(this.min == undefined || this.min > from) this.min = from;
      if(this.max  == undefined || this.max < to) this.max = to;
      current_range = new Range(from,to,key);
      total_ranges++;
      ranges.push(current_range);     
    }
    
    this.index = function(){
      return index;
    }
    
    this.current_range = function(){ return current_range; }
    
    this.enter = function(){
      current_range.add_callback.call(current_range,arguments,Responsive.STATES.ENTERS);
    }
    
    this.exit = function(){
      current_range.add_callback.call(current_range,arguments,Responsive.STATES.EXITS);
    }
    
    this.sort = function(){
      ranges = ranges.sort(function(a,b){return a.from > b.from || a.to > b.to})
      return ranges
    }
    
    this.has_next = function(){ return index < ranges.length; }
    this.has_prev = function(){ return index < 0; }
    this.current = function(){ return ranges[index] }
    
    this.next = function(){
      return ranges[++index];
    }
    
    this.prev = function(){
      return ranges[--index];
    }
    
    this.next_until = function(callback){
      var current,_current;
      _current = this.current();
      do{
        if(callback(_current)){
          current = _current;
          break;
        }
        _current = this.next();
      }while(this.has_next())
      return current;
    }
    
    this.is_before_first = function(){ return index < 0 }
    this.before_first = function(){ index = -1 }
    this.is_after_last = function(){ return index >= total_ranges }
    this.after_last = function(){ index = total_ranges }
    this.get_next = function() { return ranges[index+1] }
    this.get_prev = function() { return ranges[index-1] }
  }
  
  function Range(min,max,key){
    this.from = min; this.to = max;
    this.callbacks = {};
    this.key = (key) || (null);
  }
  
  _range = Range.prototype, _r = Responsive.prototype;
  _range.add_callback = function(args,kind){
    args = Array.prototype.slice.call(args);
    var callbacks = (this.callbacks[kind]) || (this.callbacks[kind] = [])
    for(var arg in args){
      arg = args[arg];
      switch(typeof arg){
        case "function":
          callbacks.push(arg)
          break;
      }
    }  
  }
  
  _range.toString = function(){
    return  "("+this.from+"..."+this.to+")"
  }
  
  _range.execute = function(kind,window_width){
    var _callbacks = this.callbacks[kind];
    if(!_callbacks) return
    for(var method in _callbacks)
      _callbacks[method](this.from,this.to,window_width,kind,this.key);
  }
  
  for(var _state in Responsive.STATES){;
    (function(){
      var state = Responsive.STATES[_state];
      _range[state] = function(window_width){
        this.execute(state,window_width)
      }
    })()
  }
  

  _r.from = function(from, to, key){ this.ranges.from(from, to, key); return this; }
  _r.enter = function(){ this.ranges.enter.apply(this.ranges,arguments); return this; }
  _r.exit = function(){ this.ranges.exit.apply(this.ranges,arguments); return this; }
  _r.start = function(){ this.engine.start(this.ranges,window); return this; }
  _r.stop = function(){ this.engine.stop(); return this; }
  
  var instance;
  $.responsive = function(){
    if(!instance) instance = new Responsive();
    return instance;
  }
})(jQuery,window,document)