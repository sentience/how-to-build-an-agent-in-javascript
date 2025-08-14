# Sample code for "How to Build an Agent in JavaScript"

YouTube: https://www.youtube.com/watch?v=rEf2-VC2jEIpn

Article: https://kevinyank.com/posts/how-to-build-an-agent-in-javascript/

## How to run

You will need to have [Google Cloud Platform CLI](https://cloud.google.com/sdk/docs/install) installed on your computer, after which you will need to create local authentication credentials:

```
gcloud auth application-default login
```

You will then need to assign these credentials to a GCP project you have created for your work:

```
gcloud auth application-default set-quota-project <GCP project ID>
```

See [How Application default Credentials works](https://cloud.google.com/docs/authentication/application-default-credentials#personal).

You will then need to edit the src/agent.ts file to specify the same project ID and the correct GCP region.

Once that's all done, assuming you have Node.js 20 (this is specified as a local environment with devbox.json if you happen to be using devbox), you can install project dependencies with PNPM:

```
pnpm i
```

Finally, run the agent CLI with `pnpm agent`.
