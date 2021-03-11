# Utilities

Odds and ends that we need to make the site

## Create Campaign

```
➜  node send-emails campaign create --campaignName guest-list-1                               
```

## Add users to guest list

```
% node send-emails.js guest --segment grantor --campaignName guest-list-1 --limit 50 --debug 
```

## Import list

```
% node send-emails.js import --segment guest-list-form --file ./tmp/guest-list-form.csv --limit 1000 
```

The CSV should have a header row: `email,first,last,tags,source,donation`

# build-index

In firebase we use paths like `/email/$email/$segment`. `$segment` is a subcollection of the collection `/email/$email`. In order to index this though we need data in the document at `/email/$email` ...so `build-index` populates these indicies. Going forward these should be automatically populated, but this may help re-connect things occasionally.

Unfortunately this is a bit involved, requiring first an export, a grep for emails, and a manual cleanup of these ids. You really don't want to do this again, but here's what happened:

We can export the whole db. Creating a bucket first:

```
 gsutil mb -p the-faithful gs://tmp-faithful-db
```

```
 gcloud firestore export gs://tmp-faithful-db 
```

And now you could import to BigQuery, only it looks like that requires only one collection which filters by actual documents...so we have to export the whole thing (like above) and then data munge. Hunt around the bucket interface and find the main data file, exporitng it locally. Then:

```
cat /tmp/2021-03-10T11_06_52_76421_all_namespaces_all_kinds_output-1 | strings | grep -E -o "\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b" | sort -u > /tmp/emails.txt
```

And now go manually through `/tmp/emails.txt` and clean it up.

# transcoder

NB: Largely replaced by uploading to mux.com directly. This was for when Google was going to transcode.

```
node transcoder.js transcode gs://video.the-faithful.com/input/trailer-2021-02-10/Faithful%20Trailer%20KEITH%20CUT%20Full%20resolution%20Avid%20DNxHD%20175x%20_200810.mov gs://video.the-faithful.com/output/trailer-2021-02-11/
```

