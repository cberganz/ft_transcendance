var email = "attuyamoeva@yahoo.fr";
var formateur = "Pierre";
var fin_formation = "2023-02-14";
var credits = 1.5;
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjE3ZDRkOTliMDQwODdhYjVlOWQ5ZGU3ZDI5OGZiNGZlMjk0YjdjMTY3YjM2ZDRhNzllYjRiYmIwM2MxZWI3MjVlYTZjMGFmYjIyMWY4NGY3In0.eyJhdWQiOiIxNDUiLCJqdGkiOiIxN2Q0ZDk5YjA0MDg3YWI1ZTlkOWRlN2QyOThmYjRmZTI5NGI3YzE2N2IzNmQ0YTc5ZWI0YmJiMDNjMWViNzI1ZWE2YzBhZmIyMjFmODRmNyIsImlhdCI6MTY3MzY2NTIwOSwibmJmIjoxNjczNjY1MjA5LCJleHAiOjE3MDUyMDEyMDksInN1YiI6IiIsInNjb3BlcyI6W119.eOomCmvZT0QC5lfGbDguls-IQp-Je4VnD420qXoMiTm_wYMBBIs596Cg90dghfhq3VfcPvOj3bQl_f473k9jj-IbP1csFRHSbnAsjy1iNTj0e-MZyJR7WAAYObWrOxt1BxTuPOdHGSj7Ukwpuu9wLhUS7UNbUlaEKoon1CSE8NPoYHA-CwjlzsDjlVESiOHyMJaG1OWBN-mlSIA_XV0edOOu8ewM2k-hu4ajp3FQ3Me3asYftoHB2uc3SEpEzTs4FxTe89WBmGpet9tluKr9EPVi0Ak6LEmvb-Tn1T-v4157oQIJ0r8kY3zgqnnH02DtKmYVf2EX8cJMALRLffkKdt67tNaRhxnb76TcrOlKukOGnBbIg6yZT7yOjLsrRR3zZzRKbCQ20TG-zKjEmFMUdrsiGjQVFTGeX0tHLRGo8rGW4WBMsT233oj03oWdXGJiPS3peSYYOXzEEAbCu64M-_w89BMjkjD5lutdsuWMXyqIrNIPETDXJfTZiNGJyVc_pwtTndytDQMG6vvf6o9XcdjDu2skWlrZwWdXkilHNzxKRCLIAgSSblHSVxZ0vZXkK9umLz7q8WoZLuV62C3yqHLq9T_9FKJ-7irzoiSxTlEnXX61rfLaikVBZIwP0FrBbzXLvmTIfDXWeGUe8JMl1Ot9Kyn5I1bHybL_acw82qc";
var bearerToken = "Bearer " + token;
var phone = "0783879281";
var offre = "2 Heures";
var record_i_d = "recIJxZrmBfxWnSkA";
var mesRdv = "\\n\\n <a class='button' href='https://us06web.zoom.us/j/82577429963?pwd=UWhJNVBNMnF0WjNDdEdNWDA4L25pdz09|' >Rendez-vous : vendredi 13 janvier 2023, 10:00</a> \\n\\n <a class='button' href='https://us06web.zoom.us/j/84548502045?pwd=anFZZUI5Ty9jalFvbG44U2tGanBmdz09|' >Rendez-vous : mercredi 18 janvier 2023, 14:00</a> \\n\\n <a class='button' href='https://us06web.zoom.us/j/84610277817?pwd=blVRUHM5M1BHcVhjWGJ1L2tOK1NzUT09|' >Rendez-vous : jeudi 26 janvier 2023, 14:00</a>";
var recIdCertification = "rec0fFsvEcdZnwWIU";
var myHeaders = {
  "Authorization": bearerToken,
"Content-Type": "application/json"
};
if(mesRdv){
  var a_deja_pris_un_rdv = 1;
}
else{
  var a_deja_pris_un_rdv = 0;
}

var raw = '{"action":"setLessonVariables","options":{"academy_id":"KLw1ro0GvPZp3W2VzqBm","records":{"'+ email +'":[{"key":"credits","value":' + credits + '},{"key":"formateur","value":"'+ formateur +'"},{"key":"fin_formation","value":"'+ fin_formation +'"},{"key":"offre","value":"'+ offre +'"},{"key":"phone","value":"'+ phone +'"},{"key":"record_i_d","value":"'+ record_i_d +'"}, {"key":"mes_rendez_vous2","value":"'+ mesRdv +'"},{"key":"a_deja_pris_un_rdv","value":"'+ a_deja_pris_un_rdv +'"}, {"key":"record_id_certification","value":"'+ recIdCertification +'"}]}}}';

   fetch("https://app.academyocean.com/api/v1/", {method: 'POST', headers: myHeaders, body: raw})
     .then(function(data){
     return console.log(data.json());
   })