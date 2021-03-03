# Templates

This uses handlebars to compile email templates.

We have a "default" layout that sets up most of the wrapper you should need.

And then you can add the "body" to the email on a case by case basis.

If a particular template wants to use another layout, you can use the convention
of naming the template: $layout-template-name.hbs. If no $layout is found/matches
any layouts, then the "default" template is used.

As an example: a template named
simple-forgot-password.hbs will search for a layout named "simple.hbs", and if
found, use that, putting the contents of the template where {{body}} (no spaces)
is found. If there are no layouts named 'simple', then we use the 'default'
layout.

# Compiling

Once templates have been updated, you need to compile them:

```
npm install --global gulp-cli
```

```
 % cd ROOT_DIR_OF_LAMBDA_FN && ./compile-templates
```

# Testing

To generate a test template, fill out the template context in the url, like so:

```
https://api.rooster.ai/email/TEMPLATE_NAME_HERE?to=TESTADDRESS@gmail.com&subject=TEST+SUBJECT&name=EMAIL+TO+NAME
```


## new user unpaid:

```
https://api.rooster.ai/email/new-user-unpaid?to=alex@dailypnut.com&subject=new+user+unpaid3&name=Matt+Mankins&teaser=Hi%20from%20Atri.&ctaUrl=http%3A%2F%2Fslack.dailypnut.com&paymentAmount=$25
```

## new user paid:

```
https://api.rooster.ai/email/new-user-paid?to=alex@dailypnut.com&subject=new+user+paid3&name=Matt+Mankins&teaser=Hi%20from%20Atri.&ctaUrl=http%3A%2F%2Fslack.dailypnut.com&paymentAmount=$25
```

## credit card updated:

```
https://api.rooster.ai/email/credit-card-updated?to=alex@dailypnut.com&subject=payment%20method%20updated&name=Cody+Cowan&teaser=Payment+method+updated.&ctaUrl=http%3A%2F%2Fslack.dailypnut.com&paymentAmount=$25
```

## link your twitter:

```
https://api.rooster.ai/email/link-twitter?to=alex@dailypnut.com&subject=link%20your%20twitter&name=&teaser=Link%20your%20Twiter.%20See%20your%20Atri%20account%20balance.&ctaUrl=http%3A%2F%2Fslack.dailypnut.com
```
