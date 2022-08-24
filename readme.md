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


