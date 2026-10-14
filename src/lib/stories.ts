import {award, challengeComplete, localDate, text, type Progress, type Text} from './learning';

export type StorySentence = {urdu:string; roman:string; meaning:Text};
// A book page: one illustration + a few lines, each line available in Urdu and English.
export type BookLine = {ur:string; roman:string; en:string};
export type BookPage = {art:string; lines:BookLine[]};
export type Story = {id:string; titleUrdu:string; title:Text; level:'beginner'|'intermediate'; readingLevel?:number; description:Text; cover:0|1|2|3; sentences:StorySentence[]; book?:BookPage[]; releaseWeek?:number};
// Stories that carry `book` pages open in the full-page bilingual reader; others use the sentence reader.
export const bookToSentences = (book:BookPage[]):StorySentence[] => book.flatMap(p=>p.lines.map(l=>({urdu:l.ur,roman:l.roman,meaning:text(l.en,l.en,l.en,l.en,l.en)})));
export const bookPageTask = (id:string,page:number) => `story:${id}:page:${page}`;
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

// The Tortoise and the Hare — classic Aesop fable (public domain), retold simply in Urdu + English.
const tortoiseBook:BookPage[] = [
 {art:'pair',lines:[{ur:'ایک جنگل میں ایک کچھوا اور ایک خرگوش رہتے تھے۔',roman:'Ek jungle mein ek kachhua aur ek khargosh rehte the.',en:'In a jungle lived a tortoise and a hare.'}]},
 {art:'pair',lines:[{ur:'کچھوا دھیما اور نرم دل تھا۔',roman:'Kachhua dheema aur naram dil tha.',en:'The tortoise was slow and kind.'},{ur:'خرگوش تیز مگر مغرور تھا۔',roman:'Khargosh tez magar maghroor tha.',en:'The hare was fast but proud.'}]},
 {art:'tease',lines:[{ur:'خرگوش ہمیشہ کچھوے کو چڑاتا تھا۔',roman:'Khargosh hamesha kachhuay ko chirhata tha.',en:'The hare always teased the tortoise.'},{ur:'وہ کہتا، تم بہت سست ہو۔',roman:'Woh kehta, tum bahut sust ho.',en:'He would say, you are very slow.'}]},
 {art:'startline',lines:[{ur:'ایک دن کچھوے نے کہا، آؤ دوڑ لگائیں۔',roman:'Ek din kachhuay ne kaha, aao daud lagayein.',en:'One day the tortoise said, let us have a race.'},{ur:'خرگوش زور سے ہنسا۔',roman:'Khargosh zor se hansa.',en:'The hare laughed loudly.'}]},
 {art:'startline',lines:[{ur:'دوڑ شروع ہوئی۔',roman:'Daud shuru hui.',en:'The race began.'},{ur:'خرگوش تیزی سے بہت آگے نکل گیا۔',roman:'Khargosh tezi se bahut aage nikal gaya.',en:'The hare sped far ahead.'}]},
 {art:'sleep',lines:[{ur:'خرگوش کو یقین تھا کہ وہ جیتے گا۔',roman:'Khargosh ko yaqeen tha ke woh jeetay ga.',en:'The hare was sure he would win.'},{ur:'وہ ایک درخت کے نیچے سو گیا۔',roman:'Woh ek darakht ke neeche so gaya.',en:'He fell asleep under a tree.'}]},
 {art:'pass',lines:[{ur:'کچھوا آہستہ آہستہ چلتا رہا۔',roman:'Kachhua aahista aahista chalta raha.',en:'The tortoise kept walking slowly.'},{ur:'وہ سوتے خرگوش کے پاس سے گزر گیا۔',roman:'Woh sotay khargosh ke paas se guzar gaya.',en:'He passed the sleeping hare.'}]},
 {art:'win',lines:[{ur:'کچھوا سب سے پہلے منزل پر پہنچا۔',roman:'Kachhua sab se pehle manzil par pahuncha.',en:'The tortoise reached the finish first.'},{ur:'کچھوا دوڑ جیت گیا!',roman:'Kachhua daud jeet gaya!',en:'The tortoise won the race!'}]},
 {art:'trophy',lines:[{ur:'محنت اور صبر سے کامیابی ملتی ہے۔',roman:'Mehnat aur sabr se kamyabi milti hai.',en:'Hard work and patience bring success.'}]},
];

export const stories:Story[] = [
 {id:'tortoise-and-hare',titleUrdu:'کچھوا اور خرگوش',title:text('The tortoise and the hare','कछुआ और खरगोश','السلحفاة والأرنب','কচ্ছপ ও খরগোশ','La tortuga y la liebre'),level:'beginner',cover:2,description:text('Slow and steady wins the race.','धीरे और लगातार चलने वाला जीतता है।','البطيء الثابت يفوز بالسباق.','ধীর অথচ অবিচল জয়ী হয়।','Lento pero constante gana la carrera.'),book:tortoiseBook,sentences:bookToSentences(tortoiseBook)},
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
 // Weekly stories: released one per week after the 30-day challenge is complete.
 {id:'ant-and-grasshopper',titleUrdu:'چیونٹی اور ٹڈا',title:text('The ant and the grasshopper','चींटी और टिड्डा','النملة والجندب','পিঁপড়া ও ফড়িং','La hormiga y el saltamontes'),level:'beginner',cover:3,releaseWeek:1,description:text('A little work today saves a hungry tomorrow.','आज की मेहनत कल की भूख से बचाती है।','عمل اليوم ينقذ من جوع الغد.','আজকের পরিশ্রম কালকের ক্ষুধা থেকে বাঁচায়।','El trabajo de hoy evita el hambre de mañana.'),sentences:[
  {urdu:'گرمیوں میں ایک چیونٹی کام کرتی تھی۔',roman:'Garmiyon mein ek cheontī kām kartī thī.',meaning:text('In summer, an ant was working.','गर्मियों में एक चींटी काम करती थी।','في الصيف كانت نملة تعمل.','গ্রীষ্মে একটি পিঁপড়া কাজ করত।','En verano, una hormiga trabajaba.')},
  {urdu:'وہ سردیوں کے لیے دانے جمع کرتی تھی۔',roman:'Woh sardiyon ke liye dāne jamaʿ kartī thī.',meaning:text('She gathered grain for the winter.','वह सर्दियों के लिए दाने जमा करती थी।','كانت تجمع الحبوب للشتاء.','সে শীতের জন্য দানা জমাত।','Juntaba grano para el invierno.')},
  {urdu:'ایک ٹڈا سارا دن گاتا رہتا تھا۔',roman:'Ek ṭiḍḍā sārā din gātā rehtā thā.',meaning:text('A grasshopper sang all day long.','एक टिड्डा सारा दिन गाता रहता था।','كان جندب يغنّي طوال اليوم.','একটি ফড়িং সারা দিন গান গাইত।','Un saltamontes cantaba todo el día.')},
  {urdu:'ٹڈے نے کوئی کھانا جمع نہیں کیا۔',roman:'Ṭiḍḍe ne koī khānā jamaʿ nahīn kiyā.',meaning:text('The grasshopper stored no food.','टिड्डे ने कोई खाना जमा नहीं किया।','لم يخزّن الجندب أيّ طعام.','ফড়িং কোনো খাবার জমায়নি।','El saltamontes no guardó comida.')},
  {urdu:'سردیاں آئیں اور ٹڈا بھوکا تھا۔',roman:'Sardiyān āyīn aur ṭiḍḍā bhūkā thā.',meaning:text('Winter came and the grasshopper was hungry.','सर्दियाँ आईं और टिड्डा भूखा था।','جاء الشتاء وكان الجندب جائعًا.','শীত এল আর ফড়িং ক্ষুধার্ত ছিল।','Llegó el invierno y el saltamontes tenía hambre.')},
  {urdu:'چیونٹی نے اسے کھانا دیا اور محنت کا سبق سکھایا۔',roman:'Cheontī ne use khānā diyā aur mehnat kā sabaq sikhāyā.',meaning:text('The ant gave him food and taught the value of hard work.','चींटी ने उसे खाना दिया और मेहनत का सबक सिखाया।','أعطته النملة طعامًا وعلّمته قيمة العمل.','পিঁপড়া তাকে খাবার দিল আর পরিশ্রমের শিক্ষা দিল।','La hormiga le dio comida y le enseñó el valor del esfuerzo.')},
 ]},
 {id:'sun-and-wind',titleUrdu:'سورج اور ہوا',title:text('The sun and the wind','सूरज और हवा','الشمس والريح','সূর্য ও বাতাস','El sol y el viento'),level:'beginner',cover:1,releaseWeek:2,description:text('Gentle warmth wins where force cannot.','जहाँ ज़ोर हारता है, वहाँ नरमी जीतती है।','حيث تفشل القوة ينتصر اللطف.','জোর যেখানে ব্যর্থ, কোমলতা সেখানে জেতে।','Donde la fuerza falla, gana la calidez.'),sentences:[
  {urdu:'سورج اور ہوا میں بحث ہوئی۔',roman:'Sūraj aur hawā mein bahes huī.',meaning:text('The sun and the wind had an argument.','सूरज और हवा में बहस हुई।','دار جدال بين الشمس والريح.','সূর্য ও বাতাসের মধ্যে তর্ক হল।','El sol y el viento tuvieron una discusión.')},
  {urdu:'دونوں خود کو زیادہ طاقتور سمجھتے تھے۔',roman:'Donon khud ko zyādā tāqatwar samajhte the.',meaning:text('Each thought itself the stronger one.','दोनों खुद को ज़्यादा ताक़तवर समझते थे।','ظنّ كلٌّ منهما أنّه الأقوى.','দুজনেই নিজেকে বেশি শক্তিশালী ভাবত।','Cada uno se creía el más fuerte.')},
  {urdu:'ایک مسافر نے گرم کوٹ پہنا تھا۔',roman:'Ek musāfir ne garm coaṭ pehnā thā.',meaning:text('A traveler was wearing a warm coat.','एक मुसाफ़िर ने गर्म कोट पहना था।','كان مسافر يرتدي معطفًا دافئًا.','এক পথিক একটি গরম কোট পরেছিল।','Un viajero llevaba un abrigo cálido.')},
  {urdu:'ہوا نے زور سے پھونک ماری۔',roman:'Hawā ne zor se phūnk mārī.',meaning:text('The wind blew hard.','हवा ने ज़ोर से फूँक मारी।','هبّت الريح بقوّة.','বাতাস জোরে ফুঁ দিল।','El viento sopló con fuerza.')},
  {urdu:'مسافر نے کوٹ اور مضبوطی سے پکڑ لیا۔',roman:'Musāfir ne coaṭ aur mazbūtī se pakaṛ liyā.',meaning:text('The traveler held his coat even tighter.','मुसाफ़िर ने कोट और मज़बूती से पकड़ लिया।','تشبّث المسافر بمعطفه أكثر.','পথিক কোটটি আরও শক্ত করে ধরল।','El viajero se aferró aún más al abrigo.')},
  {urdu:'پھر سورج چمکا اور مسافر نے خود کوٹ اتار دیا۔',roman:'Phir sūraj chamkā aur musāfir ne khud coaṭ utār diyā.',meaning:text('Then the sun shone and the traveler took off his coat himself.','फिर सूरज चमका और मुसाफ़िर ने खुद कोट उतार दिया।','ثمّ أشرقت الشمس فخلع المسافر معطفه بنفسه.','তারপর সূর্য উঠল আর পথিক নিজেই কোট খুলে ফেলল।','Entonces brilló el sol y el viajero se quitó el abrigo solo.')},
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

// Weekly drip: a story with a releaseWeek unlocks that many weeks after the challenge is finished.
export const weeklyCopy = {
 weekly:text('Weekly story','साप्ताहिक कहानी','قصة الأسبوع','সাপ্তাহিক গল্প','Historia semanal'),
 unlockHint:text('Finish your 30-day challenge to unlock weekly stories.','साप्ताहिक कहानियों के लिए 30 दिन की चुनौती पूरी करें।','أكمل تحدّي ٣٠ يومًا لفتح قصص الأسبوع.','সাপ্তাহিক গল্প আনলক করতে ৩০ দিনের চ্যালেঞ্জ শেষ করুন।','Completa tu reto de 30 días para desbloquear las historias semanales.'),
 nextStory:text('Your next story is on its way','आपकी अगली कहानी जल्द आ रही है','قصتك التالية في الطريق','আপনার পরের গল্প আসছে','Tu próxima historia está en camino'),
 availableNow:text('A new story is ready for you!','आपके लिए एक नई कहानी तैयार है!','قصة جديدة جاهزة لك!','আপনার জন্য নতুন গল্প প্রস্তুত!','¡Una nueva historia está lista!'),
 unlocksIn:(days:number)=>text(`Unlocks in ${days} ${days===1?'day':'days'}`,`${days} दिन में खुलेगी`,`تُفتح خلال ${days} ${days===1?'يوم':'أيام'}`,`${days} দিনে খুলবে`,`Se abre en ${days} ${days===1?'día':'días'}`),
 unlocksToday:text('Unlocks today','आज खुलेगी','تُفتح اليوم','আজ খুলবে','Se abre hoy'),
};
const dayDiff=(from:string,toDate:string)=>Math.round((new Date(`${toDate}T12:00:00`).getTime()-new Date(`${from}T12:00:00`).getTime())/86400000);
export const isWeeklyStory=(story:Story)=>typeof story.releaseWeek==='number'&&story.releaseWeek>=1;
// A weekly story needs the challenge finished, plus (releaseWeek-1) full weeks since the finish date.
export function storyUnlocked(story:Story,p:Progress,today=new Date()):boolean {
 if (!isWeeklyStory(story)) return true;
 if (!p.challengeDate || !challengeComplete(p)) return false;
 return dayDiff(p.challengeDate,localDate(today)) >= (story.releaseWeek!-1)*7;
}
// Whole days remaining before a weekly story unlocks; null when the challenge itself is still unfinished.
export function daysUntilStory(story:Story,p:Progress,today=new Date()):number|null {
 if (!isWeeklyStory(story)) return 0;
 if (!p.challengeDate || !challengeComplete(p)) return null;
 return Math.max(0,(story.releaseWeek!-1)*7 - dayDiff(p.challengeDate,localDate(today)));
}
export const coreStories=stories.filter(s=>!isWeeklyStory(s));
export const weeklyStories=stories.filter(isWeeklyStory).sort((a,b)=>(a.releaseWeek??0)-(b.releaseWeek??0));