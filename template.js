/*jshint forin:false, asi:true, laxcomma:true, eqeqeq:false, strict:false, boss:true, curly:false, eqnull:true*/
;(function(root){

  var ARRAY_CLASS = "[object Array]"
    , _toString = {}.toString
    , _hasOwn = {}.hasOwnProperty
    , content = /#{([^\}]+)\}/g


    , doc = root.document


    , escapeElement = doc.createElement("div")
    , escapeNode = doc.createTextNode("")
    , stripElement = doc.createElement("div")


    , parentNode = "parentNode"
    , nextSibling = "nextSibling"
    , removeAttribute = "removeAttribute"
    , getAttribute = "getAttribute"
    , hasAttribute = "hasAttribute"


    , dataIf = "data-if"
    , dataUnless = "data-unless"
    , dataEach = "data-each"
    , dataValue = "data-value"
    , dataWith = "data-with"
    , dataAttrs = "data-attrs"
    , dataTextNode = "data-textnode"


  escapeElement.appendChild(escapeNode)





  function escapeHTML(str){
    escapeNode.nodeValue = str
    return escapeElement.innerHTML
  }





  function stripHTML(str){
    stripElement.innerHTML = str
    return stripElement.innerText || stripElement.textContent || ""
  }





  // txt is the element representing dynamic textNodes
  doc.createElement("txt")





  function walk(element){
    var first = false
      , current = element
      , parent = []
      , lastChild

    function fn(force){
      var c, p

      if(force){
        current = force
      }

      if(!first) {
        first = true
        return element
      }

      if(!current[parentNode] && current != element) {
        while(p = parent.pop()) {
          if(c = p[nextSibling]) {
            lastChild = p
            return current = c
          }
        }
        if(lastChild) return current = lastChild[nextSibling] || null
      } else {
        if(c = current.firstChild) {
          if(current !== element) parent.push(current)
          return current = c
        }

        if(c = current[nextSibling]) {
          lastChild = current
          return current = c
        } else {
          while(p = parent.pop()) {
            if(c = p[nextSibling]) {
              lastChild = p
              return current = c
            }
          }
        }
      }

      return null
    }
    return fn
  }





  function evaluate(element, object, isClone){
    var el = isClone ? element : element.cloneNode(true)
      , walker = walk(el)
      , item
      , textNodes = []
      , textNode
      , forceWalker

    while(item = walker(forceWalker)) {
      forceWalker = null
      if(item.nodeType != item.ELEMENT_NODE) {
        if(item.nodeType == item.COMMENT_NODE) item[parentNode].removeChild(item)
        continue // ignore all non-element nodes
      }
      if(item.hasAttribute(dataTextNode)) textNodes.push(item)
      forceWalker = parse(item, object, object)
    }
    while(textNode = textNodes.pop()) {
      textNode[parentNode].replaceChild(doc.createTextNode(textNode.innerHTML), textNode)
    }
    return el
  }





  function isEmpty(obj){
    var i
    if(obj == null) return true
    if(typeof obj == "object") {
      if("length" in obj && obj.length === 0) return true
      for(i in obj) {
        if(!_hasOwn.call(obj, i)) continue
        return false
      }
      return true
    }
    return false
  }





  function getValue(value, scope, object){
    if(!value) return scope
    var start = value.charAt(0) == "/" ? object : scope
      , val = value.split("."), i = 0, l = val.length
      , currentVal = start
      , item
    for(;i < l; i++) {
      item = val[i]
      currentVal = currentVal[item]
      if(currentVal == null) return null
    }
    return currentVal
  }





  function parse(element, scope, object){
    var attribute, value, forceWalker

    attribute = element[getAttribute](dataIf)
    if(attribute !== null) {
      value = getValue(attribute, scope, object)
      if(!value || isEmpty(value)) {
        element[parentNode].removeChild(element)
        return
      } else {
        element[removeAttribute](dataIf)
      }
    }


    attribute = element[getAttribute](dataUnless)
    if(attribute !== null){
      value = getValue(attribute, scope, object)
      if(value && !isEmpty(value)) {
        element[parentNode].removeChild(element)
        return
      } else {
        element[removeAttribute](dataUnless)
      }
    }


    attribute = element[getAttribute](dataEach)
    if(attribute !== null){
      var i, l, item
      value = getValue(attribute, scope, object)
      if(value != null && typeof value == "object") {
        var fragment = doc.createDocumentFragment()
        if(_toString.call(value) == ARRAY_CLASS) {
          i = 0
          l = value.length
          for(;i < l; i++) {
            item = element.cloneNode(true)
            item[removeAttribute](dataEach)
            fragment.appendChild(evaluate(item, value[i], true))
          }
        } else {
          i = 0
          for(i in value) {
            if(!_hasOwn.call(value, i)) continue
            item = element.cloneNode(true)
            item[removeAttribute](dataEach)
            fragment.appendChild(evaluate(item, value[i], true))
          }
        }
        forceWalker = element[nextSibling]
        element[parentNode].insertBefore(fragment, element)
        element[parentNode].removeChild(element)
        return forceWalker
      }
    }



    attribute = element[getAttribute](dataValue)
    if(attribute !== null){
      value = getValue(attribute, scope, object)
      if(value != null) {
        if(element[hasAttribute]("data-escape")) {
          value = escapeHTML(value)
        }
        if(element[hasAttribute]("data-strip")) {
          value = stripHTML(value)
        }
        element[removeAttribute](dataValue)
        element.innerHTML = value || ""
      } 
    }



    attribute = element[getAttribute](dataWith)
    if(attribute !== null){
      value = getValue(attribute, scope, object)
      forceWalker = element[nextSibling]
      element[removeAttribute](dataWith)
      evaluate(element, value, true)
      return forceWalker
    }



    attribute = element[getAttribute](dataAttrs)
    if(attribute !== null){
      attribute = attribute.split(".")
      var length = attribute.length
        , get = function (a,b){return getValue(b, scope, object) || null}
        , cache

      element[removeAttribute](dataAttrs)
      for(;length--;) {
        cache = element[getAttribute](attribute[length])
        if(cache) element.setAttribute(attribute[length], cache.replace(content, get))
      }
    }

  }

  root.evaluate = evaluate

})(this.window)