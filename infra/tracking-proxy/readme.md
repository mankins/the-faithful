# tracking proxy

If only things were simple.

Mailgun has a nice tracking feature to let you know when emails are opened.

Unfortunately it only works with http and not https. 

We have some headers in place that say that all our communications should be over https...so the browser refuses to connect.

So this directory sets up a proxy from it to mailgun.org over http. HTTPS termination happens prior to this proxy.

¯\_(ツ)_/¯

