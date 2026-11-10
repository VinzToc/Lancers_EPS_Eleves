/* app-eleve.js — version élève de « Lancers EPS » (portail Applis EPS Élèves). Identifiant d'application : "lancers" (identique à la version professeur).
   Barème par défaut uniquement (aucun paramétrage). Identification et sauvegarde via eleve-core.js (base locale « EPSEleves »). */
const APP_ID='lancers';
const $=s=>document.querySelector(s),esc=LS.esc;
document.getElementById('ver').textContent=APP_VERSION;
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button,.tab').forEach(x=>x.classList.remove('act'));b.classList.add('act');$('#'+b.dataset.t).classList.add('act');if(b.dataset.t==='t2')resultats()});

const BAR=LANCERS.defaut();
let cur=null;
async function majEleve(){try{cur=await ELEVE.courant()}catch(e){cur=null}}
document.addEventListener('eleve-change',async()=>{await majEleve();if($('#t2').classList.contains('act'))resultats()});

LS.mount($('#saisie'),{
 getBaremes:()=>BAR,isCustom:()=>false,
 provMsg:'⚠ Barème provisoire pour cette épreuve : la note n’est pas définitive, demande le barème officiel à ton professeur.',
 getWho:()=>({nom:cur?cur.prenom+' '+cur.nom.toUpperCase():'',classe:cur?cur.classe:'',ok:true}),
 saveLabel:'💾 Enregistrer mes résultats',
 onSave:async l=>{
  const e=await ELEVE.demander();await majEleve();
  if(!e)throw new Error('Tu n’es pas identifié : rien n’a été enregistré. Utilise « Fiche PDF » ou identifie-toi.');
  const ok=await ELEVE.enregistrer(APP_ID,l);if(!ok)throw new Error('Enregistrement impossible : identifie-toi d’abord.');
  return `✅ Enregistré (${l['Épreuve']}, ${LS.fmt(l.Note_totale,1)}/20). Retrouve-le dans « Mes résultats ».`}
});

async function resultats(){
 await majEleve();let d={};try{d=await ELEVE.donnees()}catch(e){}
 const ls=(d[APP_ID]||[]).slice().sort((a,b)=>String(b.Date).localeCompare(String(a.Date)));
 $('#rTb').innerHTML=ls.map(l=>`<tr><td>${esc(String(l.Date||'').split('-').reverse().join('/'))}</td><td>${esc(l['Épreuve'])}</td><td>${esc(l['Catégorie']||'')}</td><td>${LS.fmt(l.Meilleur_m)}</td><td>${LS.fmt(l.M3_m)}</td><td>${l['Prévision_m']!=null?LS.fmt(l['Prévision_m']):'–'}</td><td><b>${LS.fmt(l.Note_totale,1)}</b></td></tr>`).join('')
  ||`<tr><td colspan="7">${cur?'Aucune saisie pour le moment.':'Identifie-toi (onglet Saisie) pour enregistrer et retrouver tes résultats.'}</td></tr>`;
 $('#rSum').textContent=ls.length?`${ls.length} saisie(s) enregistrée(s) sur cet appareil.`:'';
}
function msg(t,ok){const m=$('#rMsg');m.className='rgpd '+(ok?'ok':'ko');m.textContent=t}
$('#rExp').onclick=async()=>{try{await ELEVE.exporter([APP_ID]);msg('✅ Fichier exporté : remets-le à ton professeur.',true)}catch(e){msg('❌ '+(e&&e.message||e),false)}};
$('#rClr').onclick=async()=>{if(!confirm('Effacer toutes tes saisies « Lancers » sur cet appareil ?\n(Pense à exporter ton fichier avant.)'))return;
 try{const ok=await ELEVE.effacerApp(APP_ID);msg(ok?'Saisies effacées.':'Rien à effacer.',ok);resultats()}catch(e){msg('❌ '+(e&&e.message||e),false)}};

(async()=>{await majEleve();ELEVE.bandeau($('#bandeau'));
 if(!cur&&!ELEVE.sansIdentification())ELEVE.demander();
 resultats()})();
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
