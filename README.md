# alexa-app-kegbot
alexa-app-kegbot is an [alexa-app](https://github.com/matt-kruse/alexa-app) module for communication with your Kegbot. Currently is supports the following:
* What's on tap?
* How much is left?

For a more corporate friendly setup, maybe the Lambda version is better: [alexa-lambda-kegbot](https://github.com/patfreeman/alexa-lambda-kegbot)

### Requirements
* node - NodeJS http://nodejs.org
* request - NodeJS package https://www.npmjs.com/package/request
* alexa-app - NodeJS package https://www.npmjs.com/package/alexa-app
* alexa-app-server - NodeJS package https://www.npmjs.com/package/alexa-app-server used to host the app
* AWS Developer account from https://developer.amazon.com to create skill

### Setup
1. Setup a new *custom* Alexa Skill on https://developer.amazon.com/
  1. Login
  1. In the ALEXA tab, choose Alexa Skills Kit
  1. Add a New Skill
    1. Skill Information
    1. Skill Type as Custom Interaction Model
    1. Name - Give it a name
    1. Invocation Name - Give it an Invocation Name. For "Alexa, Ask Kegbot..." use Kegbot.
    1. Next
  1. Note ID at the top of the page
  1. We'll come back to this later
1. Install alexa-app-server
  1. `npm install alexa-app alexa-app-server request`
  1. `cp -R ~/node_modules/alexa-app-server/examples/ ~/node_modules/alexa-app-server/api/`
  1. `rm -rf ~/node_modules/alexa-app-server/api/apps/*`
  1. `cd ~/node_modules/alexa-app-server/api/apps/`
1. Clone Repo: `git clone https://github.com/patfreeman/alexa-app-kegbot.git`
  1. `cd alexa-app-kegbot`
  1. `npm install javascript-time-ago`
  1. `cp config_example.js config.js`
  1. `vi config.js`
    1. Set your Kegbot configuration. Protocol, host, port, API key (if required)
    1. Set your Alexa App ID which you noted in step 1.iv.
1. Configure alexa-app-server
  1. `cd ~/node_modules/alexa-app-server/api`
  1. `vi server.js`
    1. Configure the SSL port to listen on. Insert this line before the 'port:' line.
`httpsEnabled : true, httpsPort : 8443, privateKey:'private-key.pem', certificate:'certificate.pem',`
  1. Generate the SSL cert by following the directions on https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/testing-an-alexa-skill#create-a-private-key-and-self-signed-certificate-for-testing
    1. `mkdir sslcert`
    1. `cd sslcert`
    1. `openssl genrsa -out private-key.pem 2048`
    1. `vi configuration.cnf` only change the options in the req_distinguished_name and subject_alternate_names stanzas to match your external DNS name (see example file from amazon documentation) 
    1. `openssl req -new -x509 -days 365 -key private-key.pem -config configuration.cnf -out certificate.pem`
  1. Start alexa-app-server
    1. `cd ~/node_modules/alexa-app-server/api`
    1. `node server.js`
  1. Allow inbound connections on your router to the https port you configured in server.js
  1. Test the connection by going to https://<your_external_dns_name>:<https_port>/alexa/kegbot/
    1. You should get a page that says "This is a simple testing utility to POST to your endpoint and simulate an Alexa request" at the top and have a few text boxes on it.
    1. Leave this tab open. You'll need it to configure the Alexa Skill.
1. Go back to Alexa Skill setup on https://developer.amazon.com/
  1. Interation Model
    1. Paste the Schema textbox content from the other tab into Intent Schema
    1. Click Add Slot Type. Enter Type: UNITS_TYPE and paste the contents of [units_type.txt](units_type.txt) into the Enter Values box.
    1. Paste the contents of [sample_utterances.txt](sample_utterances.txt) into Sample Utterances. This a workaround for this [issue](https://github.com/alexa-js/alexa-utterances/issues/6).
    1. Next
  1. Configuration
    1. Choose HTTPS
    1. Choose 'North America'
    1. Use the URL you went to in the other tab. https://<your_external_dns_name>:<https_port>/alexa/kegbot/
    1. Next
  1. SSL Certificate
    1. Choose "I will upload a self-signed certificate in X.509 format."
    1. Paste the contents of ~/node_modules/alexa-app-server/api/sslcert/certificate.pem
    1. Save
  1. Test
    1. Try it with a sample utterance by typing "whats on tap" into the "Enter Utterance" textbox and click Ask!
1. Try talking to Alexa

### Troubleshooting
If you are having issues along the install path, you might find it useful to follow some better documentation than I can write. I started this project after stumbling through hooking my Alexa up to my OpenHAB Home Automation system using [Alexa-HA](https://github.com/unityfire/alexa-ha) written by [unityfire](https://github.com/unityfire). There is much better documentation about getting alexa-app-server up and running in the documentation for Alexa-HA.
