import {award, localDate, text, type Progress, type Text} from './learning';

export type StorySentence = {urdu:string; roman:string; meaning:Text};
export type Story = {id:string; titleUrdu:string; title:Text; level:'beginner'|'intermediate'; readingLevel?:number; description:Text; cover:0|1|2|3; sentences:StorySentence[]};
export const storyCopy = {
 stories:text('Stories','कहानियाँ','القصص','গল্প','Historias'),
 subtitle:text('Little stories. A whole new world.','छोटी कहानियाँ। एक नई दुनिया।','قصص صغيرة. عالم جديد.','ছোট গল্প। এক নতুন জগৎ।','Pequeñas historias. Un mundo nuevo.'),
 all:text('All stories','सभी कहानियाँ','كل القصص','সব গল্প','Todas las historias'),
 sentences:text('sentences','वाक्य','جمل','বাক্য','frases'),
 sentence:text('Sentence','वाक्य','الجملة','বাক্য','Frase'),
 next:text('Next sentence','अगला वाक्य','الجملة التالية','পরের বাক্য','Siguiente frase'),
 previous:text('Previous sentence','पिछला वाक्य','الجملة السابقة','আগের বাক্য','Frase anterior'),
 back:text('Back to stories','कहानियों पर लौटें','العودة إلى القصص','গল্পে ফিরে যান','Volver a las historias'),
 done:text('Story complete!','कहानी पूरी हुई!','اكتملت القصة!','গল্প শেষ!','¡Historia completada!'),
 readAgain:text('Read again','फिर पढ़ें','اقرأ مجددًا','আবার পড়ুন','Leer de nuevo'),
 noStories:text('More stories are on their way.','और कहानियाँ जल्द आ रही हैं।','قصص أخرى قادمة قريبًا.','আরও গল্প আসছে।','Pronto habrá más historias.'),
 friend:text('Every story starts with one little sentence.','हर कहानी एक छोटे वाक्य से शुरू होती है।','تبدأ كل قصة بجملة صغيرة.','প্রতিটি গল্প একটি ছোট বাক্য দিয়ে শুরু হয়।','Cada historia empieza con una pequeña frase.'),
 finish:text('Finish story','कहानी समाप्त करें','إنهاء القصة','গল্প শেষ করুন','Terminar historia'),
 completedSentences:text('sentences completed','वाक्य पूरे हुए','جمل مكتملة','বাক্য সম্পন্ন','frases completadas'),
};

export const stories:Story[] = [
 {id:'thirsty-crow',titleUrdu:'پیاسا کوا',title:text('The thirsty crow','प्यासा कौआ','الغراب العطشان','তৃষ্ণার্ত কাক','El cuervo sediento'),level:'beginner',cover:0,description:text('A clever crow finds a way to drink.','एक समझदार कौआ पानी पीने का उपाय ढूँढता है।','غراب ذكي يجد طريقة للشرب.','এক বুদ্ধিমান কাক পানি পান করার উপায় খুঁজে পায়।','Un cuervo ingenioso encuentra cómo beber.'),sentences:[
  {urdu:'ایک کوا پیاسا تھا۔',roman:'Ek kawwā pyāsā thā.',meaning:text('A crow was thirsty.','एक कौआ प्यासा था।','كان غراب عطشانًا.','একটি কাক তৃষ্ণার্ত ছিল।','Un cuervo tenía sed.')},
  {urdu:'اس نے ایک گھڑا دیکھا۔',roman:'Us ne ek ghaṛā dekhā.',meaning:text('It saw a water jug.','उसने एक घड़ा देखा।','رأى جرّة ماء.','সে একটি কলস দেখল।','Vio una jarra de agua.')},
  {urdu:'گھڑے میں تھوڑا پانی تھا۔',roman:'Ghaṛe mein thoṛā pānī thā.',meaning:text('There was a little water in the jug.','घड़े में थोड़ा पानी था।','كان في الجرّة قليل من الماء.','কলসে অল্প পানি ছিল।','Había un poco de agua en la jarra.')},
  {urdu:'اس نے گھڑے میں کنکر ڈالے۔',roman:'Us ne ghaṛe mein kankar ḍāle.',meaning:text('It put pebbles into the jug.','उसने घड़े में कंकड़ डाले।','وضع حصى في الجرّة.','সে কলসে নুড়ি ফেলল।','Puso piedritas en la jarra.')},
  {urdu:'پانی اوپر آ گیا۔',roman:'Pānī ūpar ā gayā.',meaning:text('The water rose.','पानी ऊपर आ गया।','ارتفع الماء.','পানি উপরে উঠে এল।','El agua subió.')},
  {urdu:'کوے نے پانی پیا۔',roman:'Kawwe ne pānī piyā.',meaning:text('The crow drank the water.','कौए ने पानी पिया।','شرب الغراب الماء.','কাকটি পানি পান করল।','El cuervo bebió el agua.')},
 ]},
 {id:'honest-woodcutter',titleUrdu:'ایمان دار لکڑہارا',title:text('The honest woodcutter','ईमानदार लकड़हारा','الحطّاب الأمين','সৎ কাঠুরে','El leñador honrado'),level:'beginner',cover:1,description:text('An honest answer brings a happy ending.','एक सच्चा जवाब खुशी लाता है।','إجابة صادقة ونهاية سعيدة.','একটি সৎ উত্তর সুখের সমাপ্তি আনে।','Una respuesta sincera trae un final feliz.'),sentences:[
  {urdu:'ایک لکڑہارا لکڑی کاٹتا تھا۔',roman:'Ek lakaṛhārā lakaṛī kāṭtā thā.',meaning:text('A woodcutter used to cut wood.','एक लकड़हारा लकड़ी काटता था।','كان حطّاب يقطع الخشب.','এক কাঠুরে কাঠ কাটত।','Un leñador cortaba madera.')},
  {urdu:'اس کی کلہاڑی دریا میں گر گئی۔',roman:'Us kī kulhāṛī daryā mein gir gaī.',meaning:text('His axe fell into the river.','उसकी कुल्हाड़ी नदी में गिर गई।','سقط فأسه في النهر.','তার কুড়াল নদীতে পড়ে গেল।','Su hacha cayó al río.')},
  {urdu:'ایک پری پانی سے نکلی۔',roman:'Ek parī pānī se niklī.',meaning:text('A fairy came out of the water.','एक परी पानी से निकली।','خرجت جنّية من الماء.','এক পরী পানি থেকে বেরিয়ে এল।','Un hada salió del agua.')},
  {urdu:'اس کے پاس سونے کی کلہاڑی تھی۔',roman:'Us ke pās sone kī kulhāṛī thī.',meaning:text('She had a golden axe.','उसके पास सोने की कुल्हाड़ी थी।','كان معها فأس ذهبي.','তার কাছে সোনার কুড়াল ছিল।','Tenía un hacha de oro.')},
  {urdu:'لکڑہارے نے کہا، یہ میری نہیں ہے۔',roman:'Lakaṛhāre ne kahā, yeh merī nahīn hai.',meaning:text('The woodcutter said, “This is not mine.”','लकड़हारे ने कहा, “यह मेरी नहीं है।”','قال الحطّاب: هذا ليس فأسي.','কাঠুরে বলল, “এটি আমার নয়।”','El leñador dijo: «Esta no es mía».')},
  {urdu:'پری نے لوہے کی کلہاڑی دکھائی۔',roman:'Parī ne lohe kī kulhāṛī dikhāī.',meaning:text('The fairy showed an iron axe.','परी ने लोहे की कुल्हाड़ी दिखाई।','أرت الجنّية فأسًا من حديد.','পরী লোহার কুড়াল দেখাল।','El hada mostró un hacha de hierro.')},
  {urdu:'لکڑہارے نے کہا، یہ میری ہے۔',roman:'Lakaṛhāre ne kahā, yeh merī hai.',meaning:text('The woodcutter said, “This is mine.”','लकड़हारे ने कहा, “यह मेरी है।”','قال الحطّاب: هذا فأسي.','কাঠুরে বলল, “এটি আমার।”','El leñador dijo: «Esta es mía».')},
  {urdu:'پری نے اسے دونوں کلہاڑیاں دے دیں۔',roman:'Parī ne use donon kulhāṛiyān de dīn.',meaning:text('The fairy gave him both axes.','परी ने उसे दोनों कुल्हाड़ियाँ दे दीं।','أعطته الجنّية الفأسين.','পরী তাকে দুটি কুড়ালই দিয়ে দিল।','El hada le dio las dos hachas.')},
 ]},
 {id:'lion-and-mouse',titleUrdu:'شیر اور چوہا',title:text('The lion and the mouse','शेर और चूहा','الأسد والفأر','সিংহ ও ইঁদুর','El león y el ratón'),level:'beginner',cover:2,description:text('Even a little friend can be a big help.','एक छोटा दोस्त भी बड़ी मदद कर सकता है।','حتى الصديق الصغير يمكنه تقديم مساعدة كبيرة.','ছোট বন্ধুও বড় সাহায্য করতে পারে।','Un amigo pequeño también puede ayudar mucho.'),sentences:[
  {urdu:'ایک شیر سو رہا تھا۔',roman:'Ek sher so rahā thā.',meaning:text('A lion was sleeping.','एक शेर सो रहा था।','كان أسد نائمًا.','একটি সিংহ ঘুমাচ্ছিল।','Un león dormía.')},
  {urdu:'ایک چوہا اس کے پاس آیا۔',roman:'Ek chūhā us ke pās āyā.',meaning:text('A mouse came near him.','एक चूहा उसके पास आया।','اقترب منه فأر.','একটি ইঁদুর তার কাছে এল।','Un ratón se acercó a él.')},
  {urdu:'شیر نے چوہے کو پکڑ لیا۔',roman:'Sher ne chūhe ko pakaṛ liyā.',meaning:text('The lion caught the mouse.','शेर ने चूहे को पकड़ लिया।','أمسك الأسد بالفأر.','সিংহ ইঁদুরটিকে ধরল।','El león atrapó al ratón.')},
  {urdu:'چوہے نے کہا، مجھے چھوڑ دو۔',roman:'Chūhe ne kahā, mujhe chhoṛ do.',meaning:text('The mouse said, “Let me go.”','चूहे ने कहा, “मुझे छोड़ दो।”','قال الفأر: اتركني أذهب.','ইঁদুর বলল, “আমাকে ছেড়ে দাও।”','El ratón dijo: «Déjame ir».')},
  {urdu:'شیر نے اسے چھوڑ دیا۔',roman:'Sher ne use chhoṛ diyā.',meaning:text('The lion let him go.','शेर ने उसे छोड़ दिया।','تركه الأسد يذهب.','সিংহ তাকে ছেড়ে দিল।','El león lo dejó ir.')},
  {urdu:'ایک دن شیر جال میں پھنس گیا۔',roman:'Ek din sher jāl mein phans gayā.',meaning:text('One day the lion got caught in a net.','एक दिन शेर जाल में फँस गया।','ذات يوم علق الأسد في شبكة.','একদিন সিংহ জালে আটকে গেল।','Un día el león quedó atrapado en una red.')},
  {urdu:'چوہے نے جال کاٹ دیا۔',roman:'Chūhe ne jāl kāṭ diyā.',meaning:text('The mouse cut through the net.','चूहे ने जाल काट दिया।','قرض الفأر الشبكة.','ইঁদুর জাল কেটে দিল।','El ratón cortó la red.')},
  {urdu:'شیر آزاد ہو گیا۔',roman:'Sher āzād ho gayā.',meaning:text('The lion was free.','शेर आज़ाद हो गया।','أصبح الأسد حرًّا.','সিংহ মুক্ত হল।','El león quedó libre.')},
 ]},
 {id:'my-family',titleUrdu:'میرا خاندان',title:text('My family','मेरा परिवार','عائلتي','আমার পরিবার','Mi familia'),level:'beginner',cover:3,description:text('A little day at home with the people we love.','अपनों के साथ घर पर एक दिन।','يوم في البيت مع من نحبّ.','প্রিয়জনদের সঙ্গে বাড়িতে একটি দিন।','Un día en casa con quienes queremos.'),sentences:[
  {urdu:'یہ میرا گھر ہے۔',roman:'Yeh merā ghar hai.',meaning:text('This is my home.','यह मेरा घर है।','هذا بيتي.','এটি আমার বাড়ি।','Esta es mi casa.')},
  {urdu:'یہ میری امی ہیں۔',roman:'Yeh merī ammī hain.',meaning:text('This is my mother.','यह मेरी माँ हैं।','هذه أمّي.','ইনি আমার মা।','Esta es mi madre.')},
  {urdu:'یہ میرے ابو ہیں۔',roman:'Yeh mere abbū hain.',meaning:text('This is my father.','यह मेरे पिता हैं।','هذا أبي.','ইনি আমার বাবা।','Este es mi padre.')},
  {urdu:'میری ایک بہن ہے۔',roman:'Merī ek behen hai.',meaning:text('I have one sister.','मेरी एक बहन है।','لديّ أخت واحدة.','আমার একটি বোন আছে।','Tengo una hermana.')},
  {urdu:'ہم مل کر کھانا کھاتے ہیں۔',roman:'Ham mil kar khānā khāte hain.',meaning:text('We eat together.','हम मिलकर खाना खाते हैं।','نأكل معًا.','আমরা একসঙ্গে খাই।','Comemos juntos.')},
  {urdu:'ہم مل کر کتاب پڑھتے ہیں۔',roman:'Ham mil kar kitāb paṛhte hain.',meaning:text('We read a book together.','हम मिलकर किताब पढ़ते हैं।','نقرأ كتابًا معًا.','আমরা একসঙ্গে বই পড়ি।','Leemos un libro juntos.')},
 ]},
];

export const storySentenceXp = 20;
export const sentenceTask = (id:string,index:number) => `story:${id}:sentence:${index}`;
export const storyTask = (id:string) => `story:${id}:complete`;
export const completedStorySentences = (story:Story,p:Progress) => story.sentences.filter((_,i)=>p.tasks.includes(sentenceTask(story.id,i))).length;
export function completeStorySentence(p:Progress,story:Story,index:number,date=localDate()):Progress {
 if (!Number.isInteger(index) || !story.sentences[index]) return p;
 const next=award(p,sentenceTask(story.id,index),storySentenceXp);
 if (completedStorySentences(story,next)!==story.sentences.length || next.tasks.includes(storyTask(story.id))) return next;
 return {...next,tasks:[...next.tasks,storyTask(story.id)],dates:next.dates.includes(date)?next.dates:[...next.dates,date]};
}