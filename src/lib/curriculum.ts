import {text,lessons,letters,copy,normalizeWords,type Text} from './learning';

// One learning item shown on a lesson card: a main Urdu string, its roman reading,
// a translated gloss, and (for joining lessons) the component letters that build it.
export type Item = {main:string; sub:string; gloss:Text; parts?:string[]};
export type DayKind = 'letters'|'build'|'marks'|'words'|'sentence';
export type Day =
 | {kind:'letters'; letters:number[]}
 | {kind:Exclude<DayKind,'letters'>; title:Text; intro:Text; items:Item[]};

const i = (main:string,sub:string,gloss:Text,parts?:string[]):Item => parts?{main,sub,gloss,parts}:{main,sub,gloss};

// Days 14-30: joining → vowel marks → vocabulary → sentences → review.
const extraDays:Day[] = [
 // Day 14 — joining letters into words
 {kind:'build',title:text('Joining letters','अक्षर जोड़ना','وصل الحروف','অক্ষর যুক্ত করা','Unir letras'),intro:text('Letters hold hands to make a word. Tap Listen and watch them join.','अक्षर हाथ मिलाकर शब्द बनाते हैं। सुनें और जुड़ते देखें।','تتماسك الحروف لتكوّن كلمة. استمع وشاهدها تتّصل.','অক্ষরগুলো হাত ধরে শব্দ বানায়। শুনুন আর যুক্ত হতে দেখুন।','Las letras se unen para formar una palabra. Escucha y míralas unirse.'),items:[
  i('بات','bāt',text('a matter, talk','बात','أمر، حديث','কথা','un asunto, charla'),['ب','ا','ت']),
  i('قلم','qalam',text('pen','क़लम','قلم','কলম','bolígrafo'),['ق','ل','م']),
  i('گھر','ghar',text('house','घर','منزل','ঘর','casa'),['گ','ھ','ر']),
  i('دودھ','dūdh',text('milk','दूध','حليب','দুধ','leche'),['د','و','د','ھ']),
 ]},
 // Day 15 — joining longer words
 {kind:'build',title:text('Building words','शब्द बनाना','بناء الكلمات','শব্দ গড়া','Formar palabras'),intro:text('Now bigger words. Say each letter, then the whole word.','अब बड़े शब्द। हर अक्षर बोलें, फिर पूरा शब्द।','الآن كلمات أكبر. انطق كل حرف ثم الكلمة كاملة.','এবার বড় শব্দ। প্রতিটি অক্ষর বলুন, তারপর পুরো শব্দ।','Ahora palabras más largas. Di cada letra y luego la palabra entera.'),items:[
  i('شہر','shahr',text('city','शहर','مدينة','শহর','ciudad'),['ش','ہ','ر']),
  i('کمرہ','kamra',text('room','कमरा','غرفة','ঘর/কামরা','habitación'),['ک','م','ر','ہ']),
  i('سڑک','saṛak',text('road','सड़क','طريق','রাস্তা','calle'),['س','ڑ','ک']),
  i('بازار','bāzār',text('market','बाज़ार','سوق','বাজার','mercado'),['ب','ا','ز','ا','ر']),
 ]},
 // Day 16 — short vowel marks (zabar, zer, pesh)
 {kind:'marks',title:text('Vowel marks','स्वर चिह्न','الحركات','স্বরচিহ্ন','Signos vocálicos'),intro:text('Tiny marks give a letter its vowel. Listen to how each one changes the sound.','छोटे चिह्न अक्षर को स्वर देते हैं। हर चिह्न से आवाज़ बदलती है, सुनें।','تمنح العلامات الصغيرة الحرف حركته. استمع كيف تغيّر كل واحدة الصوت.','ছোট চিহ্ন অক্ষরকে স্বর দেয়। প্রতিটি কীভাবে ধ্বনি বদলায় শুনুন।','Los pequeños signos dan la vocal a la letra. Escucha cómo cambia el sonido.'),items:[
  i('بَ','ba',text('zabar → short “a”','ज़बर → छोटा “अ”','زبر ← «a» قصيرة','যবর → ছোট “a”','zabar → “a” corta')),
  i('بِ','bi',text('zer → short “i”','ज़ेर → छोटा “इ”','زير ← «i» قصيرة','যের → ছোট “i”','zer → “i” corta')),
  i('بُ','bu',text('pesh → short “u”','पेश → छोटा “उ”','ضمة ← «u» قصيرة','পেশ → ছোট “u”','pesh → “u” corta')),
  i('بّ','bb',text('shadda → doubled letter','शद्दा → दोहरा अक्षर','شدّة ← حرف مضعّف','শদ্দা → দ্বিগুণ অক্ষর','shadda → letra doble')),
 ]},
 // Day 17 — long vowels and madd
 {kind:'marks',title:text('Long vowels','दीर्घ स्वर','حروف المدّ','দীর্ঘ স্বর','Vocales largas'),intro:text('Alif, wao and ye stretch a sound long. Hear the difference.','अलिफ़, वाओ और ये आवाज़ को लंबा करते हैं। फ़र्क़ सुनें।','ألف وواو وياء تمدّ الصوت. اسمع الفرق.','আলিফ, ওয়াও ও ইয়ে ধ্বনিকে দীর্ঘ করে। পার্থক্য শুনুন।','Alif, wao y ye alargan el sonido. Escucha la diferencia.'),items:[
  i('با','bā',text('long “aa” with alif','अलिफ़ से लंबा “आ”','«aa» طويلة بالألف','আলিফ দিয়ে দীর্ঘ “aa”','“aa” larga con alif')),
  i('بی','bī',text('long “ee” with ye','ये से लंबा “ई”','«ee» طويلة بالياء','ইয়ে দিয়ে দীর্ঘ “ee”','“ee” larga con ye')),
  i('بو','bū',text('long “oo” with wao','वाओ से लंबा “ऊ”','«oo» طويلة بالواو','ওয়াও দিয়ে দীর্ঘ “oo”','“oo” larga con wao')),
  i('آ','ā',text('alif madd → long “aa”','अलिफ़ मद → लंबा “आ”','ألف ممدودة ← «aa» طويلة','আলিফ মদ → দীর্ঘ “aa”','alif madd → “aa” larga')),
 ]},
 // Day 18 — numbers 1-10
 {kind:'words',title:text('Numbers 1–10','संख्याएँ 1–10','الأرقام ١–١٠','সংখ্যা ১–১০','Números 1–10'),intro:text('Count with me in Urdu, from one to ten.','मेरे साथ उर्दू में एक से दस तक गिनें।','عُدّ معي بالأردية من واحد إلى عشرة.','আমার সঙ্গে উর্দুতে এক থেকে দশ গুনুন।','Cuenta conmigo en urdu, del uno al diez.'),items:[
  i('ایک','ek',text('one','एक','واحد','এক','uno')),
  i('دو','do',text('two','दो','اثنان','দুই','dos')),
  i('تین','tīn',text('three','तीन','ثلاثة','তিন','tres')),
  i('چار','chār',text('four','चार','أربعة','চার','cuatro')),
  i('پانچ','pānch',text('five','पाँच','خمسة','পাঁচ','cinco')),
  i('دس','das',text('ten','दस','عشرة','দশ','diez')),
 ]},
 // Day 19 — family
 {kind:'words',title:text('My family','मेरा परिवार','عائلتي','আমার পরিবার','Mi familia'),intro:text('The first people we love — now in Urdu.','जिन्हें हम सबसे पहले प्यार करते हैं — उर्दू में।','أوّل من نحبّهم — الآن بالأردية.','প্রথম যাদের ভালোবাসি — উর্দুতে।','Las primeras personas que amamos, en urdu.'),items:[
  i('ماں','māñ',text('mother','माँ','أمّ','মা','madre')),
  i('باپ','bāp',text('father','पिता','أب','বাবা','padre')),
  i('بہن','behen',text('sister','बहन','أخت','বোন','hermana')),
  i('بھائی','bhāī',text('brother','भाई','أخ','ভাই','hermano')),
  i('دادا','dādā',text('grandfather','दादा','جدّ','দাদা','abuelo')),
 ]},
 // Day 20 — home & things
 {kind:'words',title:text('Around the home','घर के आसपास','في المنزل','ঘরের চারপাশে','En casa'),intro:text('Everyday things you can see right now.','रोज़मर्रा की चीज़ें जो अभी दिख रही हैं।','أشياء يومية يمكنك رؤيتها الآن.','প্রতিদিনের জিনিস যা এখনই দেখা যায়।','Cosas cotidianas que puedes ver ahora.'),items:[
  i('دروازہ','darwāza',text('door','दरवाज़ा','باب','দরজা','puerta')),
  i('کھڑکی','khiṛkī',text('window','खिड़की','نافذة','জানালা','ventana')),
  i('میز','mez',text('table','मेज़','طاولة','টেবিল','mesa')),
  i('کرسی','kursī',text('chair','कुर्सी','كرسي','চেয়ার','silla')),
  i('چابی','chābī',text('key','चाबी','مفتاح','চাবি','llave')),
 ]},
 // Day 21 — food & drink
 {kind:'words',title:text('Food and drink','खाना और पीना','طعام وشراب','খাবার ও পানীয়','Comida y bebida'),intro:text('Tasty words for the table.','मेज़ के लिए स्वादिष्ट शब्द।','كلمات شهيّة للمائدة.','টেবিলের জন্য সুস্বাদু শব্দ।','Palabras sabrosas para la mesa.'),items:[
  i('پانی','pānī',text('water','पानी','ماء','পানি','agua')),
  i('روٹی','roṭī',text('bread','रोटी','خبز','রুটি','pan')),
  i('چائے','chāy',text('tea','चाय','شاي','চা','té')),
  i('پھل','phal',text('fruit','फल','فاكهة','ফল','fruta')),
  i('چاول','chāwal',text('rice','चावल','أرزّ','চাল/ভাত','arroz')),
 ]},
 // Day 22 — colours
 {kind:'words',title:text('Colours','रंग','الألوان','রং','Colores'),intro:text('Paint your words with colour.','अपने शब्दों में रंग भरें।','لوّن كلماتك.','আপনার শব্দে রং দিন।','Dale color a tus palabras.'),items:[
  i('سرخ','surkh',text('red','लाल','أحمر','লাল','rojo')),
  i('نیلا','nīlā',text('blue','नीला','أزرق','নীল','azul')),
  i('ہرا','harā',text('green','हरा','أخضر','সবুজ','verde')),
  i('پیلا','pīlā',text('yellow','पीला','أصفر','হলুদ','amarillo')),
  i('کالا','kālā',text('black','काला','أسود','কালো','negro')),
 ]},
 // Day 23 — animals
 {kind:'words',title:text('Animals','जानवर','الحيوانات','প্রাণী','Animales'),intro:text('Friends with fur, feathers and paws.','रोएँ, पंख और पंजों वाले दोस्त।','أصدقاء بفراء وريش وأقدام.','লোম, পালক আর থাবাওয়ালা বন্ধু।','Amigos con pelo, plumas y patas.'),items:[
  i('شیر','sher',text('lion','शेर','أسد','সিংহ','león')),
  i('بلی','billī',text('cat','बिल्ली','قطّة','বিড়াল','gato')),
  i('کتا','kuttā',text('dog','कुत्ता','كلب','কুকুর','perro')),
  i('گھوڑا','ghoṛā',text('horse','घोड़ा','حصان','ঘোড়া','caballo')),
  i('مچھلی','machhlī',text('fish','मछली','سمكة','মাছ','pez')),
 ]},
 // Day 24 — greetings & courtesy
 {kind:'words',title:text('Greetings','अभिवादन','التحيّات','শুভেচ্ছা','Saludos'),intro:text('Warm words to open any door.','हर दरवाज़ा खोलने वाले मीठे शब्द।','كلمات دافئة تفتح كل باب.','প্রতিটি দরজা খোলার মতো উষ্ণ শব্দ।','Palabras cálidas que abren cualquier puerta.'),items:[
  i('سلام','salām',text('peace / hello','सलाम / नमस्ते','سلام / مرحبا','সালাম / হ্যালো','paz / hola')),
  i('شکریہ','shukriya',text('thank you','शुक्रिया','شكرًا','ধন্যবাদ','gracias')),
  i('معاف کیجیے','muʿāf kījiye',text('excuse me / sorry','माफ़ कीजिए','المعذرة','মাফ করবেন','disculpe')),
  i('خدا حافظ','khudā hāfiz',text('goodbye','ख़ुदा हाफ़िज़','مع السلامة','বিদায়','adiós')),
 ]},
 // Day 25 — pronouns & "to be"
 {kind:'words',title:text('I, you, we','मैं, तुम, हम','أنا، أنت، نحن','আমি, তুমি, আমরা','Yo, tú, nosotros'),intro:text('The little words that start most sentences.','ज़्यादातर वाक्य इन्हीं छोटे शब्दों से शुरू होते हैं।','الكلمات الصغيرة التي تبدأ بها معظم الجمل.','বেশিরভাগ বাক্য এই ছোট শব্দ দিয়ে শুরু হয়।','Las palabritas con que empiezan casi todas las frases.'),items:[
  i('میں','main',text('I','मैं','أنا','আমি','yo')),
  i('تم','tum',text('you','तुम','أنت','তুমি','tú')),
  i('وہ','woh',text('he / she / it','वह','هو / هي','সে','él / ella')),
  i('ہم','ham',text('we','हम','نحن','আমরা','nosotros')),
  i('ہے','hai',text('is','है','يكون','হয়/আছে','es / está')),
 ]},
 // Day 26 — sentences: this is
 {kind:'sentence',title:text('This is…','यह है…','هذا…','এটি…','Esto es…'),intro:text('Put your new words into your first full sentences.','अपने नए शब्दों से पहले पूरे वाक्य बनाएँ।','ضع كلماتك الجديدة في أوّل جمل كاملة.','নতুন শব্দ দিয়ে প্রথম পূর্ণ বাক্য বানান।','Usa tus palabras nuevas en tus primeras frases completas.'),items:[
  i('یہ میرا گھر ہے۔','Yeh merā ghar hai.',text('This is my house.','यह मेरा घर है।','هذا بيتي.','এটি আমার বাড়ি।','Esta es mi casa.')),
  i('یہ ایک کتاب ہے۔','Yeh ek kitāb hai.',text('This is a book.','यह एक किताब है।','هذا كتاب.','এটি একটি বই।','Esto es un libro.')),
  i('وہ میری ماں ہیں۔','Woh merī māñ hain.',text('That is my mother.','वह मेरी माँ हैं।','تلك أمّي.','উনি আমার মা।','Esa es mi madre.')),
  i('پانی ٹھنڈا ہے۔','Pānī ṭhanḍā hai.',text('The water is cold.','पानी ठंडा है।','الماء بارد.','পানি ঠান্ডা।','El agua está fría.')),
 ]},
 // Day 27 — sentences: I have / I want
 {kind:'sentence',title:text('I have, I want','मेरे पास है, मुझे चाहिए','لديّ، أريد','আমার আছে, আমি চাই','Tengo, quiero'),intro:text('Ask for what you need in Urdu.','उर्दू में माँगना सीखें।','اطلب ما تحتاجه بالأردية.','উর্দুতে যা দরকার চাইতে শিখুন।','Pide lo que necesitas en urdu.'),items:[
  i('میرے پاس قلم ہے۔','Mere pās qalam hai.',text('I have a pen.','मेरे पास क़लम है।','لديّ قلم.','আমার কাছে কলম আছে।','Tengo un bolígrafo.')),
  i('مجھے پانی چاہیے۔','Mujhe pānī chāhiye.',text('I want water.','मुझे पानी चाहिए।','أريد ماءً.','আমি পানি চাই।','Quiero agua.')),
  i('مجھے چائے پسند ہے۔','Mujhe chāy pasand hai.',text('I like tea.','मुझे चाय पसंद है।','أحبّ الشاي.','আমি চা পছন্দ করি।','Me gusta el té.')),
  i('ہمیں کھانا چاہیے۔','Hamein khānā chāhiye.',text('We want food.','हमें खाना चाहिए।','نريد طعامًا.','আমরা খাবার চাই।','Queremos comida.')),
 ]},
 // Day 28 — sentences: questions
 {kind:'sentence',title:text('Asking questions','सवाल पूछना','طرح الأسئلة','প্রশ্ন করা','Hacer preguntas'),intro:text('A good question opens a conversation.','अच्छा सवाल बातचीत खोलता है।','السؤال الجيّد يفتح حوارًا.','ভালো প্রশ্ন কথোপকথন খোলে।','Una buena pregunta abre una conversación.'),items:[
  i('یہ کیا ہے؟','Yeh kyā hai?',text('What is this?','यह क्या है?','ما هذا؟','এটি কী?','¿Qué es esto?')),
  i('آپ کیسے ہیں؟','Āp kaise hain?',text('How are you?','आप कैसे हैं?','كيف حالك؟','আপনি কেমন আছেন?','¿Cómo estás?')),
  i('آپ کا نام کیا ہے؟','Āp kā nām kyā hai?',text('What is your name?','आपका नाम क्या है?','ما اسمك؟','আপনার নাম কী?','¿Cómo te llamas?')),
  i('یہ کتنے کا ہے؟','Yeh kitne kā hai?',text('How much is this?','यह कितने का है?','بكم هذا؟','এটির দাম কত?','¿Cuánto cuesta esto?')),
 ]},
 // Day 29 — short reading
 {kind:'sentence',title:text('A little story','एक छोटी कहानी','قصة صغيرة','ছোট্ট গল্প','Una pequeña historia'),intro:text('Read a few lines together — you already know every word.','कुछ पंक्तियाँ साथ पढ़ें — हर शब्द आप जानते हैं।','اقرأ بضعة أسطر معًا — تعرف كل كلمة.','কয়েকটি লাইন একসঙ্গে পড়ুন — প্রতিটি শব্দ আপনি জানেন।','Lee unas líneas juntas: ya conoces cada palabra.'),items:[
  i('میرا نام علی ہے۔','Merā nām Ali hai.',text('My name is Ali.','मेरा नाम अली है।','اسمي علي.','আমার নাম আলি।','Me llamo Ali.')),
  i('یہ میرا گھر ہے۔','Yeh merā ghar hai.',text('This is my house.','यह मेरा घर है।','هذا بيتي.','এটি আমার বাড়ি।','Esta es mi casa.')),
  i('ہمارے گھر میں ایک بلی ہے۔','Hamāre ghar mein ek billī hai.',text('There is a cat in our house.','हमारे घर में एक बिल्ली है।','في بيتنا قطّة.','আমাদের বাড়িতে একটি বিড়াল আছে।','En nuestra casa hay un gato.')),
  i('ہم روز چائے پیتے ہیں۔','Ham roz chāy pīte hain.',text('We drink tea every day.','हम रोज़ चाय पीते हैं।','نشرب الشاي كل يوم.','আমরা প্রতিদিন চা খাই।','Bebemos té todos los días.')),
 ]},
 // Day 30 — review & graduation
 {kind:'sentence',title:text('Graduation review','स्नातक समीक्षा','مراجعة التخرّج','সমাপনী পর্যালোচনা','Repaso final'),intro:text('Your final day! A little of everything you learned. Finish to earn your certificate.','आपका आख़िरी दिन! सब कुछ का थोड़ा-थोड़ा। पूरा करके प्रमाणपत्र पाएँ।','يومك الأخير! قليل من كل ما تعلّمته. أكمل لتنال شهادتك.','আপনার শেষ দিন! যা শিখেছেন তার একটু করে। শেষ করে সনদ নিন।','¡Tu último día! Un poco de todo lo aprendido. Termina y gana tu certificado.'),items:[
  i('السلام علیکم!','As-salāmu ʿalaikum!',text('Peace be upon you! (hello)','अस्सलामु अलैकुम! (नमस्ते)','السلام عليكم!','আসসালামু আলাইকুম!','¡La paz sea contigo! (hola)')),
  i('میرے پاس ایک کتاب ہے۔','Mere pās ek kitāb hai.',text('I have a book.','मेरे पास एक किताब है।','لديّ كتاب.','আমার কাছে একটি বই আছে।','Tengo un libro.')),
  i('یہ پانی ٹھنڈا اور صاف ہے۔','Yeh pānī ṭhanḍā aur sāf hai.',text('This water is cold and clean.','यह पानी ठंडा और साफ़ है।','هذا الماء بارد ونظيف.','এই পানি ঠান্ডা ও পরিষ্কার।','Esta agua está fría y limpia.')),
  i('شکریہ، میں نے اردو سیکھی!','Shukriya, main ne Urdu sīkhī!',text('Thank you, I learned Urdu!','शुक्रिया, मैंने उर्दू सीखी!','شكرًا، لقد تعلّمت الأردية!','ধন্যবাদ, আমি উর্দু শিখেছি!','¡Gracias, aprendí urdu!')),
 ]},
];

export const curriculum:Day[] = [...lessons.map(group=>({kind:'letters' as const,letters:group})), ...extraDays];

export function dayDef(day:number):Day|undefined {return curriculum[day-1];}
export function dayInfo(day:number):{kind:DayKind; glyph:string; title:Text} {
 const def=curriculum[day-1];
 if(!def) return {kind:'letters',glyph:'',title:copy.sounds};
 if(def.kind==='letters') return {kind:'letters',glyph:letters[def.letters[0]??0]?.glyph??'',title:day===1?copy.letters:copy.sounds};
 return {kind:def.kind,glyph:def.items[0]?.main??'',title:def.title};
}

// Every Urdu string a lesson can ask narration for — folded into the TTS allowlist.
export const lessonAudioTexts:string[] = [...new Set(extraDays.flatMap(day=>day.kind==='letters'?[]:day.items.flatMap(item=>[item.main,...(item.parts??[]),...normalizeWords(item.main)])))];
