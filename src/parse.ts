function parse() {
  const post_url = PropertiesService.getScriptProperties().getProperty('POST_URL');
  const regexp_http = RegExp("https?(://[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)", 'g');
  const regexp_image = RegExp('\\.(jpg|png|gif)$', 'i');
  const regexp_mail = RegExp('\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+', 'g');
  const mail = new MyGmail('label:クリック', 15);
  if (mail.messages.length === 0) {
    return;
  }

  var data: object[] = [];
  for (let message of mail.messages) {
    let send_at = Utilities.formatDate(message.getDate(), 'JST', "yyyy-MM-dd'T'HH:mm:ss");
    let mail_to = message.getTo().match(regexp_mail)[0];
    let mail_from = message.getFrom().match(regexp_mail)[0];
    let subject = message.getSubject();
    for (let url of message.getBody().match(regexp_http)) {
      if (url.match(regexp_image)) {
        continue;
      }
      data.push({
        'send_at': send_at,
        'mail_to': mail_to,
        'mail_from': mail_from,
        'subject': subject,
        'url': url,
      });
    }
  }

  if (data.length > 0) {
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(data),
    };
    let response = UrlFetchApp.fetch(post_url, options);
    if (response.getResponseCode() !== 200) {
      return;
    }
  }
  mail.deleteAll();
}
