template
========

**template** is a simple DOM based templating engine. 

It's mostly based on `data` attributes and a block-level logic. For instance, if you apply a `data-each` on an element, this element with be reproduced for each item in the given object. 

The advantages of that is that you already have nodes ready, and you can easily use a custom helper to bind events while you're parsing the data. Also, the fact that it uses `data` attributes makes it semantic, easy to read in any text editor, as it's basic HTML. It's valid HTML code, and has no impact on SEO, as no content is in the elements. 

## todo

* tests

## doc

### attributes

* `data-if` : interprets the element if the tested value isn't empty or falsy, otherwise removes it
* `data-unless` : interprets the element if the tested value is empty or falsy, otherwise removes it
* `data-each` : interprets and repeats the element for each item in an object
* `data-value` : sets the `innerHTML` property of with the given value
* `data-content` : sets the `innerHTML` with the content, replacing `#{key.key}` with the given values property of with the given value
* `data-textnode` : converts the element into a _textNode_, escapes HTML tags by default. 
* `data-strip` : Strips the value's HTML tags. 
* `data-escape` : Escapes the value's HTML tags.
* `data-attrs` :  Comma separated list of attributes to parse like `data-content`

### comments

Comments are HTML comments. 

```html
<!-- This is a comment that is ignored by the parser -->
```

### mixins 

#### Custom helpers

With : 

```js
evaluate.addCustomHelper("uppercase", function(element, attributeValue, scope, globalScope){
  element.innerHTML = element.innerHTML.toUpperCase()
  element.style.fontSize = ".8em"
})
```



You can now use : 

```html
<span data-uppercase data-value="/i18n/SOME_KEY"></span>
```
You can remove helpers using 

```js
evaluate.removeCustomHelper("uppercase")
```

## usage

### template

```html
<section id="templates" hidden>
  <!-- Template international user-list -->
  <div class="user-list">
    <!-- titles -->
    <h3 data-unless="users" data-value="/i18n.NO_USERS"></h3>
    <h3 data-if="users" data-content="#{/i18n.HAVE} #{users.length} #{/i18n.USERS}"></h3>
    <!-- list -->
    <ul class="user-list-items" data-if="users">
      <li data-each="users">
        <p>
          <strong data-value="/i18n.NAME" data-uppercase></strong>
          <span data-textnode data-value="name" data-strip></span>
        </p>
        <p>
          <strong data-value="/i18n.DESCRIPTION" data-uppercase></strong>
          <span data-textnode data-value="description" data-strip></span>
        </p>
      </li>
    </ul>
  </div>
</section>
```

### data

```js
var users =  [
        {name:"John Smith", description:"<strong>teacher</strong>"}
      , {name:"Jane Smith", description:"<strong>doctor</strong>"}
      , {name:"Jim", description:"<strong>student</strong>"}
    ]
  , i18n = {
          NO_USERS : "No user found"
        , HAVE : "Have"
        , USERS : "users"
        , NAME : "Name :"
        , DESCRIPTION : "Description :"
      }
  , data = {users:users, i18n:i18n}
```

### js

```js
// custom helper
evaluate(document.getElementById("templates").children[0], data)
```

### rendering

```html
<div class="user-list">
  <h3>Have 3 users</h3>
  <ul class="user-list-items">
    <li>
      <p>
        <strong>Name :</strong>
        John Smith
      </p>
      <p>
        <strong>Description :</strong>
        teacher
      </p>
    </li><li>
      <p>
        <strong>Name :</strong>
        Jane Smith
      </p>
      <p>
        <strong>Description :</strong>
        doctor
      </p>
    </li><li>
      <p>
        <strong>Name :</strong>
        Jim
      </p>
      <p>
        <strong>Description :</strong>
        student
      </p>
    </li>
  </ul>
</div>
```
 