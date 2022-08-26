# Getting Started with Vue data

[One-Way Data Flow](https://vuejs.org/guide/components/props.html#prop-passing-details)

Most values on the web can change at any moment, such as the number of likes on a post or the current set of posts to display. We call constantly-changing data values like this dynamic data. We need a place to store dynamic data values so that we can still use them in our HTML even when we don’t know what their values will be at any given moment. There are many different ways to do this in Vue.

The simplest way is the data property on the options object. The value of data is an object. Each key-value pair in this object corresponds to a piece of data to be displayed in the template. The key is the name of the data to use in the template and the value is the value to display when the template is rendered.

```
const app = new Vue({
  el: '#app',
  data: {
    language: 'Spanish',
    hoursStudied: 274
  }
});
```

```
<div id="app">
  <p>You have been studying {{ language }} for {{ hoursStudied }} hours</p>
</div>
```

---
## Computed Properties
Vue allows us to store `data` that can be calculated using values from the data object at a separate property called `computed`.

Instead of storing computed data as key-value pairs in our `data` object, we store key-value pairs in a separate `computed` object. Each key in the computed object is the name of the property and the value is a function that can be used to generate a value rather than a specific value.

```
const app = new Vue({
  el: '#app',
  data: {
    hoursStudied: 274
  },
  computed: {
    languageLevel: function() {
      if (this.hoursStudied < 100) {
        return 'Beginner';
      } else if (this.hoursStudied < 1000) {
        return 'Intermediate';
      } else {
        return 'Expert';
      }
    }
  }
});
```

```
<div id="app">
  <p>You have studied for {{ hoursStudied }} hours. You have {{ languageLevel }}-level mastery.</p>
</div>
```
In this example, we need to know how many hours the user has studied in order to determine their language mastery. The number of hours is known, so we store it in data. However, we need to use hoursStudied in order to compute languageLevel, so languageLevel must be stored in computed.

The Vue app determines the value of languageLevel using the provided function. In this case, hoursStudied is 274, so languageLevel will be 'Intermediate'. The template will display You have studied for 274 hours. You have Intermediate-level mastery.. If numberOfHours were to change, languageLevel would automatically be recomputed as well.

In order to reference a value from data in this function, we treat that value as an instance property using this. followed by the name of the data — in our example, this.hoursStudied.

Finally, in order to display computed values in our template, we use mustaches surrounding the name of the computed property just as we did for data.
---

## Computed Property Setters
Vue allows us to not only determine `computed` values based on `data` values but to also update the necessary `data` values if a `computed` value ever changes! This allows our users to potentially edit `computed` values in the front-end and have all of the corresponding `data` properties get changed in response so that the `computed` property will re-calculate to the user’s chosen value.

```
const app = new Vue({
  el: '#app',
  data: {
    hoursStudied: 274
  },
  computed: {
    languageLevel: {
      get: function() {
        if (this.hoursStudied < 100) {
          return 'Beginner';
        } else if (this.hoursStudied < 1000) {
          return 'Intermediate';
        } else {
          return 'Expert';
        }
      },
      set: function(newLanguageLevel) {
        if (newLanguageLevel === 'Beginner') {
          this.hoursStudied = 0;
        } else if (newLanguageLevel === 'Intermediate') {
          this.hoursStudied = 100;
        } else if (newLanguageLevel === 'Expert') {
          this.hoursStudied = 1000;
        }
      }
    }
  }
});
```

```
<div id=“app”>
  <p>You have studied for {{ hoursStudied }} hours. You have {{ languageLevel }}-level mastery.</p>
  <span>Change Level:</span>
  <select v-model="languageLevel">
    <option>Beginner</option>
    <option>Intermediate</option>
    <option>Expert</option>
  </select>
</div>
```

In this example:

- We modified our `computed` `languageLevel` value to contain both a getter and a setter method. We did this by making the value of `languageLevel` an object with two keys, `get` and `set`, each with a value of a function.
  
- The `get` function is the same function we used earlier, computing the value of languageLevel based on hoursStudied.
  
- The `set` function updates other data whenever the value of `languageLevel` changes. `set` functions take one parameter, the new value of the `computed` value. This value can then be used to determine how other information in your app should be updated. In this case, whenever `languageLevel `changes, we set the value of `hoursStudied` to be the minimum number of hours needed to achieve that mastery level.
  
- Finally, we added a `<select>` field to our template that allows users to change their mastery level. Don’t worry about this part of the logic yet, we will cover this information in Vue Forms.

---
## Watchers
So far we’ve learned that data is used to store known dynamic data and computed is used to store dynamic data that is computed using other pieces of dynamic data. However, there is one caveat.

A computed value will only recompute when a dynamic value used inside of its getter function changes. For example, in our previous examples languageLevel would only be recomputed if hoursStudied changed. But what do we do if we want to make app updates without explicitly using a value in a computed function? We use the watch property.

```

const app = new Vue({
  el: '#app',
  data: {
    currentLanguage: 'Spanish',
    supportedLanguages: ['Spanish', 'Italian', 'Arabic'],
    hoursStudied: 274
  },
  watch: {
    currentLanguage: function (newCurrentLanguage, oldCurrentLanguage) {
      if (supportedLanguages.includes(newCurrentLanguage)) {
        this.hoursStudied = 0;
      } else {
        this.currentLanguage = oldCurrentLanguage;
      }
    }
  }
});

```

This functionality is not a `computed` value because we do not actually need to continually use this information to compute a new dynamic property: we just need to update existing properties whenever the change happens.


The value of `watch` is an object containing all of the properties to watch. The keys of this object are the names of the properties to watch for changes and the values are functions to run whenever the corresponding properties change. **These functions take two parameters: the new value of that property and the previous value of that property.**

**Note:** It may seem like you could use `watch` in many instances where you could use `computed`. The Vue team encourages developers to use `computed` in these situations as `computed` values update more efficiently than `watch`ed values.

---
## Instance Methods

The methods property is where Vue apps store their instance methods. These methods can be used in many situations, such as helper functions used in other methods or event handlers (functions that are called in response to specific user interactions).

```
const app = new Vue({
  el: "#app",
  data: {
    hoursStudied: 300
  },
  methods: {
    resetProgress: function () {
      this.hoursStudied = 0;
    }
  }
});
```

`<button v-on:click="resetProgress">Reset Progress</button>`


In this example, we added an instance method called `resetProgress` to our Vue app using `methods`. This method sets the value of `hoursStudied` to 0.

We then added this method as an event handler to a `<button>` so that whenever the button is clicked, the method will be called. Don’t worry about the v-on:click code for this lesson — we will cover it in Vue Forms.

The value of `methods` is an object where the keys of the object are the names of the methods and the values are the corresponding instance methods.

---
## Review

Here’s a brief recap of the Vue app options object properties we covered and the use cases for each.

 - data - used for storing known dynamic values
  
 - computed - used for computing dynamic values based on known dynamic values  — can additionally specify a setter by specifying get and set functions — the setter will update other dynamic values when the computed value changes

- watch - used for performing functionality when a specified dynamic value changes

- methods - used for storing instance methods to be used throughout the app

- learn more about each of these properties, check out the [Options / Data section of the Vue.js documentation](https://vuejs.org/api/#Options-Data).

---
# VUE FORMS

## Text, Textarea, and Select Bindings
In Vue Data, we learned that there are two main places to store dynamic data in Vue apps: `data` for known dynamic values and `computed` for dynamic values that are determined using other dynamic values.

In web development, it is very common to add forms to sites to allow users to modify these types of dynamic values. As a result, Vue has implemented a directive, called `v-model`, that automatically binds form fields to dynamic values on the Vue app. When a form field is bound to a value, whenever the value in that form field changes, the value on the Vue app will change to the same value as well. Similarly, if the data on the Vue app changes, the value in the form field will automatically change to reflect the new value to the user.

`<input type="text" v-model="username" />`

```
const app = new Vue({ 
  el: '#app',
  data: { username: 'Michael' } 
});
```

In this example, we bound an `<input> `field to a piece of Vue data called username, like so:

We added a piece of dynamic data to the Vue app called username
We used v-model on an `<input>` field to bind the `<input>` to the piece of data with the provided name: username.

However, `v-model` also works with computed properties as well.

`v-model `works on all HTML form field elements. So, simple form fields such as `<textarea>` elements and `<select>` elements can be bound to `data` and `computed` properties in the exact same way: adding `v-model="propertyName"` to the opening tag of the elements.

---
## Radio Button Bindings

In HTML, each radio button is its own `<input>` field. However, they all correspond to the same piece of data in the Vue app. As a result, each `<input>` field will need its own `v-model `directive. However, the value of `v-model` for each `<input>` will be the same: the name of the property they all correspond to.

```
<legend>How was your experience?</legend>
 
<input type="radio" id="goodReview" value="good" v-model="experienceReview" />
<label for="goodReview">Good</label>
 
<input type="radio" id="neutralReview" value="neutral" v-model="experienceReview" />
<label for="neutralReview">Neutral</label>
 
<input type="radio" id="badReview" value="bad" v-model="experienceReview" />
<label for="badReview">Bad</label>
```

```
const app = new Vue({ 
  el: '#app', 
  data: { experienceReview: '' } 
});
```

---
## Array Checkbox Bindings
Checkboxes are used in situations where users can select multiple options for a form field. Unlike radio buttons, previous selections won’t be unselected when new selections are added. Instead, users can select all of the relevant checkboxes they’d like.

As a result, the dynamic piece of data bound to these types of checkboxes must be an array. This array stores all of the values checked in the list of checkboxes.

```
<legend>Which of the following features would you like to see added?</legend>
 
<input type="checkbox" id="search-bar" value="search" v-model="requestedFeatures">
<label for="search-bar">Search Bar</label>
 
<input type="checkbox" id="ads" value="ads" v-model="requestedFeatures">
<label for="ads">Ads</label>
 
<input type="checkbox" id="new-content" value="content" v-model="requestedFeatures">
<label for="new-content">New Content</label>
```

```
const app = new Vue({ 
  el: '#app', 
  data: { requestedFeatures: ['search', 'content'] } 
});
```

---
## Boolean Checkbox Bindings

You may not always use a list of checkboxes. Sometimes you may only need a single checkbox to indicate whether a user has or has not checked a single option. In this case, we need to change the type of Vue data bound to the checkbox.

As seen in the previous example, if you are using a list of checkboxes with values, they need to be bound to an array to store all of the checked values. A single checkbox, however, can be represented by a boolean value. If the checkbox is checked, the value is true — if the value is unchecked, the value is false.

```
<legend>Would you recommend this site to a friend?</legend>
<input type="checkbox" v-model="wouldRecommend" />
```
```
const app = new Vue({ 
  el: '#app',
  data: { wouldRecommend: false } 
});
```

In this example, we’ve added `v-model` to a single checkbox. If the user would recommend this site to their friends, they will check the box and the value of `wouldRecommend` will be set to `true`. If they uncheck the box or leave it unchecked, the value of `wouldRecommend` will be `false`

---
## Form Event Handlers
As seen in [MDN’s list of events](https://developer.mozilla.org/en-US/docs/Web/Events#Form_Events), forms have two built-in events that we need to handle: `submit` events (when a submit button is pressed to submit the final form) and `reset` events (when a reset button is pressed to reset the form to its initial state).

As we saw briefly in Introduction to Vue, Vue uses the `v-on` directive to add event handlers. Event handlers will respond to the specified event by calling the specified method.

We can use the `v-on `directive on `<form>` elements to add form event handling functionality, like so:

```
<form v-on:reset="resetForm">
  ...
  <button type="reset">Reset</button>
</form>
```


```
const app = new Vue({ 
  el: '#app', 
  methods: { resetForm: function() { ... } }
});
```
Note: A common shorthand for event handlers involves replacing v-on: with @, like so: Both syntaxes are acceptable and used in Vue applications

```
<form @reset="resetForm">
  ...
</form>
```

---
## Form Event Modifiers

Event objects have built-in methods to modify this behavior, such as `Event.preventDefault() `(which stops the browser from performing its default event-handling behavior) and `Event.stopPropagation()` (which stops the event from continuing to be handled beyond the current handler).

Vue gives developers access to these methods in the form of **modifiers**. Modifiers are properties that can be added to directives to change their behavior. Vue includes modifiers for many common front-end operations, such as event handling.

```
<form v-on:submit.prevent="submitForm">
  ...
</form>
```
---
## Input Modifiers

Modifiers are incredibly useful tools for quickly adding essential front-end logic to directives. Vue offers modifiers for many of their directives, including the main topic of this lesson: `v-model`. Yes, that’s right, we can use modifiers to make our form fields even more versatile.

Vue offers the following three modifiers for v-model:

- `.number` — automatically converts the value in the form field to a number
  
- `.trim` — removes whitespace from the beginning and ends of the form field value
  
- `.lazy` — only updates data values when `change` events are triggered (often when a user moves away from the form field rather than after every keystroke)

---
## Form Validation

There are many ways to implement form validation in Vue — we will cover one of the more common methods.

This method makes heavy use of the `disabled` `<button>` property. In brief, if `disabled` is present (or set to `true`) on a `<button>` element, that `<button>` will not do anything when pressed. Whereas if disabled is not present (or set to `false`), the button will work as expected. You can find more information about the disabled property in the MDN `<button>` documentation.


`<button type="submit" v-bind:disabled="!formIsValid">Submit</button>`

```
const app = new Vue({ 
  el: '#app', 
  computed: { 
    formIsValid: function() { ... } 
  }
});
```

- We use the `v-bind` directive to set the value of the `disabled` property on a “Submit” button to the value of a computed property called `formIsValid`
  
- `formIsValid` will contain some logic that checks the values stored on the Vue app and returns a boolean representing whether or not the form is valid

- If the form is valid, `formIsValid` will return `true` and the `disabled` property will not be present on the “Submit” button, keeping the button enabled

- If the form is not valid, `formIsValid` will return `false` and the button will be disabled

---
## Review

- Form fields can be bound to Vue data using the `v-model` directive — how `v-model` is used depends on the type of field it is being added to

- Form event handlers can be added using `v-on:submit` and `v-on:reset`
  
- Modifiers can be used to add functionality to directives — most importantly preventing page reload on form submission using `v-on:submit.prevent` and cleaning up form field values using `.number` and `.trim`
  
- Form validation can be implemented by setting the value of the `disabled `attribute on a `<button>` to the value of a computed property using `v-bind`

---
# STYLING ELEMENTS WITH VUE
## Inline Styles

Here is the syntax for adding dynamic inline styles using Vue:

```
<h2 v-bind:style="{ color: breakingNewsColor, 'font-size': breakingNewsFontSize }">Breaking News</h2>
```

```
const app = new Vue({ 
  data: { 
    breakingNewsColor: 'red',
    breakingNewsFontSize: '32px'
  }
});
```

---

## Computed Style Objects
A common pattern for adding dynamic inline style objects is to add a dynamic Vue app property that generates the style object. For example, we could refactor the previous example as follows:

```
<h2 v-bind:style="breakingNewsStyles">Breaking News</h2>
```

```
const app = new Vue({ 
  data: { 
    breakingNewsStyles: { 
      color: 'red',
      'font-size': '32px'
    }
  }
});
```

In this example, we store the style object, breakingNewsStyles, as a Vue app property and then make that object the value of v-bind:style. Using this pattern, we can make style objects for specific, reusable use cases.

---
## Multiple Style Objects
Another powerful aspect of v-bind:style is that it can also take an array of style objects as a value.

```
const app = new Vue({ 
  data: {
    newsHeaderStyles: { 
      'font-weight': 'bold', 
      color: 'grey'
    },
    breakingNewsStyles: { 
      color: 'red'
    }
  }
});
```

`<h2 v-bind:style="[newsHeaderStyles, breakingNewsStyles]">Breaking News</h2>`

In this example, we’ve added another Vue app property, newsHeaderStyles. This is a style object that will presumably be used to style all news item headers. Then, using an array with v-bind:style, we add both of these style objects to our Breaking News element.

You may notice that both of these style objects contain a color value. When this happens, the style object added later in the array gets priority. So, Breaking News will be bold and red. The grey color rule will be overridden and not used.

---
## Classes
All hyphenated keys in JavaScript objects must be put in quotes to be parsed as valid keys.

`<span v-bind:style="{ color: 'blue', 'font-size': '48px' }">Big Blue</span>`

Let’s check out how to dynamically add CSS classes instead of inline styles.

```
<span v-bind:class="{ unread: hasNotifications }">Notifications</span>
```

```
.unread {
  background-color: blue;
}
```

```
const app = new Vue({
  data: { notifications: [ ... ] },
  computed: {
    hasNotifications: function() {
      return notifications.length > 0;
    }
  }
}
```

In this example, if there are notifications in the notifications array, the unread class will be added to the “Notifications” element causing the element to be styled blue.

Similar to before with v-bind:style, you can also set the value of v-bind:class to a Vue app property that returns a class object instead of writing the object out in your HTML file.

---
## Class Arrays
The conflicting style rule added last to the array will be the one used on the element.

As was the case when we were applying style objects, sometimes we need to apply multiple class objects to a single element. To accommodate this, v-bind:class can take an array as its value.

This array can take class objects as its contents and will apply the classes to the element in the order of the class objects in the array. However, this array can also take one other type of element.

While class objects are good for conditionally adding classes to elements, sometimes we need to just add a class to an element regardless of conditions. When this is the case, you can add the class name to the array and it will always be applied to the element. These class names must be stored as properties on your Vue app.

```
<span v-bind:class="[{ unread: hasNotifications }, menuItemClass]">Notifications</span>
```

```
const app = new Vue({
  data: { 
    notifications: [ ... ],
    menuItemClass: 'menu-item'
  },
  computed: {
    hasNotifications: function() {
      return notifications.length > 0;
    }
  }
}
```

```
.menu-item {
  font-size: 12px;
}
 
.unread {
  background-color: blue;
}
```

In this code, we have modified our previous example by changing the value of v-bind:class to be an array. We then added a Vue app property to the end of the array that will add the menu-item class to the element. The object at the beginning of the array will still conditionally add the unread class based on whether there are unread notifications. However, we now always add the class stored at menuItemClass, menu-item, to our “Notifications” element.

Using an array with v-bind:class is useful for adding non-conditional classes, like the menu-item class above, in addition to our conditional classes. We can also use this array to add multiple class objects like we did with our inline style objects earlier in the lesson.