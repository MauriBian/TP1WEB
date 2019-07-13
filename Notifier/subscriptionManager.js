const fs = require('fs');
const promisify = require('util').promisify;
const {google} = require('googleapis');
const getGmailClient = require('./gmailClient');

// Obtiene un objeto JJJJJ a partir del credentials.json y token.json
const gmailClient = getGmailClient();

let subscriptions = new Map();

class SubscriptionManager{

  addSubscriber(artistId, emailSub){
    if (subscriptions.has(artistId)){
      let subscribers = subscriptions.get(artistId)
      if (!subscribers.includes(emailSub)){
        subscribers.push(emailSub);
        console.log('adding subscriber to exiting artist ')
      } 
    }
    else{
    console.log('adding subscriber to new artist ')
    subscriptions.set(artistId, [emailSub]); 
  }
  }

  getSubscribers(artistId){
    console.log('getSubscribers - artistId:'+ artistId)
    return subscriptions.get(artistId);
  }

  deleteSubscriber(artistId, emailSub){
    console.log('deleteSubscriber')
    console.log('deleting artistId: '+artistId + ' email: '+ emailSub)
    if (subscriptions.has(artistId)){
      let list = subscriptions.get(artistId);
      subscriptions.set(artistId, this.removeElement(emailSub, list));
    }
  }

  removeElement(id,list){
    return list.filter(elem => elem != id)
  }

 
  deleteAllSubscribers(artistId){
    console.log('delete all subscribers - artistId:' +artistId)
    if (subscriptions.has(artistId)){
      subscriptions.delete(artistId);
    }
  }


// Envia un mail a cada subscriptor del artista con artistId, con la informacion del nuevo album
  notifySubscribers(artistId, subject, content){
    console.log('notifying subscribers')
    let subscribers = subscriptions.get(artistId)
    subscribers.forEach(subEmail => { //TODO: cambiar forEach por algun otro lambda
    gmailClient.users.messages.send(
      {
        userId: 'me',
        requestBody: {
          raw: this.createMessage(subEmail, subject, content),
        },
      }
    )
   });
  
}

createMessage(subEmail, subject, content){
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To: <${subEmail}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    content,
  ];
  const message = messageParts.join('\n');

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); 

    return encodedMessage;
}

}
module.exports = {SubscriptionManager : SubscriptionManager}