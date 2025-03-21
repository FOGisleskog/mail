document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => {
    isReplying = false;
    compose_email();
  });

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(email) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#mail-main').style.display = 'none';

  if (isReplying = false){
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  } else {
    document.querySelector('#compose-recipients').value = email.sender;
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
    document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: \n${email.body}`; 
  }

  document.querySelector('#compose-form').onsubmit = function (event) {
    event.preventDefault();
    isReplying = false;
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    const data = {
      recipients: recipients,
      subject: subject,
      body: body,
    }

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          alert(result.error);
        } else {
          alert('Email sent successfully!');
          load_mailbox('sent');
        }
      })
      .catch(error => {
        alert('Something went wrong while sending the email. Please try again.');
        console.error(error);
      });
  }

}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-main').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Conditional fetch based on which mailbox we are loading
  if (mailbox === 'sent') {
    fetch('/emails/sent')
      .then(response => response.json())
      .then(emails => {

        // Loop through each email and display them
        emails.forEach(email => {
          const emailElement = document.createElement('div');
          emailElement.setAttribute("id", "Email")
          emailElement.classList.add('email');

          emailElement.innerHTML = `
          <div id="mail">
          <p><strong>To:</strong> ${email.recipients}</p>
          <div class="email-details">
          <p><span class="email-subject"><strong>Subject:</strong> ${email.subject}<span>
          <span class="email-timestamp"><strong>Created:</strong> ${email.timestamp}<span></p>
          </div>
          </div>
        `;

        emailElement.addEventListener('click', () => load_mail(email.id));

        document.querySelector('#emails-view').append(emailElement);
        });
      })
      .catch(error => {
        console.error('Error loading sent emails:', error);
        alert('Could not load sent emails.');
      });

  }

    if (mailbox === 'inbox') {
    fetch('/emails/inbox')
      .then(response => response.json())
      .then(emails => {
        const emailsView = document.querySelector('#emails-view');

        emails.forEach(email => {
          const emailElement = document.createElement('div');
          if (email.read === true){
          emailElement.setAttribute("id", "Email_read")
          } else {
          emailElement.setAttribute("id", "Email")
          }
          emailElement.classList.add('email');
          emailElement.dataset.emailId = email.id;

          emailElement.innerHTML = `
          <p><strong>To:</strong> ${email.recipients}</p>
          <div class="email-details">
          <p><span class="email-subject"><strong>Subject:</strong> ${email.subject}</span>
          <span class="email-timestamp"><strong>Created:</strong> ${email.timestamp}</span></p>
          </div>
        `;

          emailsView.append(emailElement);
        });
      })
      .catch(error => {
        console.error('Error loading sent emails:', error);
        alert('Could not load sent emails.');
      });

      document.querySelector('#emails-view').addEventListener('click', (event) => {
        const emailElement = event.target.closest('.email');
        const emailId =emailElement?.dataset.emailId;
        
        if (emailElement && !event.target.matches('.archive-button')) {
          load_mail(emailId);
          return;
        }
      

      if (event.target.matches('.archive-button')) {
        event.stopPropagation();
        const emailId = event.target.dataset.emailId;

        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ archived: event.target.innerText.includes('Unarchive') })
      })            
      .then(response => {           
        if (response.ok) {
        console.log("Email archived/unarchived successfully")
        load_mailbox('archive');
        } else {
          return response.text().then(errorText => {
              console.error("Failed to archive/unarchive email:", errorText);
              throw new Error(errorText);
          });
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while archiving/unarchiving the email. Please try again.");
      });
    }
    });

    }

      if (mailbox === 'archive') {
        fetch('/emails/archive')
      .then(response => response.json())
      .then(emails => {

        // Loop through each email and display them
        emails.forEach(email => {
          const emailElement = document.createElement('div');
          emailElement.setAttribute("id", "Email")
          emailElement.classList.add('email');

          emailElement.innerHTML = `
          <div id="mail">
          <p><strong>To:</strong> ${email.recipients}</p>
          <div class="email-details">
          <p><span class="email-subject"><strong>Subject:</strong> ${email.subject}<span>
          <span class="email-timestamp"><strong>Created:</strong> ${email.timestamp}<span></p>
          </div>
          </div>
        `;

        emailElement.addEventListener('click', () => load_mail(email.id));

        document.querySelector('#emails-view').append(emailElement);
        });
      })
      .catch(error => {
        console.error('Error loading sent emails:', error);
        alert('Could not load sent emails.');
      });
    }
    }
 
function load_mail(email_id) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#mail-main').style.display = 'block';
  

  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      
      fetch(`/emails/${email.id}`, {
       method: 'PUT',
       headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ read: true }), 
      })
      .then(() => {
        storedemail = email;
      })
      console.log(email);

      const emailView = document.createElement('div');
      emailView.classList.add('email-details');
    
      emailView.innerHTML = `
      <div class="email-details-container">
          <h3 class="email-subject">Subject: ${email.subject}</h3>
          <div class="email-meta">
              <p><strong>From:</strong> ${email.sender}</p>
              <p><strong>To:</strong> ${email.recipients.join(", ")}</p>
              <p><strong>Timestamp:</strong> ${email.timestamp}</p>
          </div>
          <hr>
          <div class="email-body">
              <p>${email.body}</p>
          </div>
          <button id="reply" class="action-btn"> 
          Reply
          </button>
      </div>
      `;
      
      const mailMain = document.querySelector('#mail-main');
      mailMain.innerHTML = "";
      mailMain.append(emailView);
      let isReplying = false;


      document.querySelector('#reply').addEventListener('click', () => {
        isReplying = true;
        compose_email(storedemail);
      })


      
    });
}
  

