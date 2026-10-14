import {instructionUrdu} from './urdu-ui';
import {validAvatar,type AvatarId} from './avatars';
export type Language = 'en' | 'hi' | 'ar' | 'bn' | 'es' | 'ur';
export const languages: {id: Language; native: string; name: string; flag: string}[] = [
  {id:'en',native:'English',name:'English',flag:'🇬🇧'}, {id:'ur',native:'اردو',name:'Urdu',flag:'🇵🇰'}, {id:'hi',native:'हिन्दी',name:'Hindi',flag:'🇮🇳'}, {id:'ar',native:'العربية',name:'Arabic',flag:'🇸🇦'}, {id:'bn',native:'বাংলা',name:'Bengali',flag:'🇧🇩'}, {id:'es',native:'Español',name:'Spanish',flag:'🇪🇸'},
];
export type Text = Record<Exclude<Language,'ur'>,string> & {ur?:string};
export const text = (en:string,hi:string,ar:string,bn:string,es:string,ur?:string):Text => ({en,hi,ar,bn,es,ur:ur??instructionUrdu(en)??en});
export const copy = {
 learn:text('My learning','मेरी पढ़ाई','تعلّمي','আমার শেখা','Mi aprendizaje'), read:text('Read aloud','ज़ोर से पढ़ें','القراءة بصوت عالٍ','জোরে পড়ুন','Leer en voz alta'), writing:text('Practice writing','लिखने का अभ्यास','تدريب الكتابة','লেখার অনুশীলন','Practicar escritura'), profile:text('My profile','मेरी प्रोफ़ाइल','ملفي الشخصي','আমার প্রোফাইল','Mi perfil'),
 challenge:text('30-day challenge','30 दिन की चुनौती','تحدّي ٣٠ يومًا','৩০ দিনের চ্যালেঞ্জ','Reto de 30 días'), greeting:text('A little Urdu. A little every day.','हर दिन थोड़ी उर्दू।','قليل من الأردية، كل يوم.','প্রতিদিন একটু উর্দু।','Un poco de urdu, cada día.'), intro:text('Big journeys begin with small letters. Let’s make yours a good one.','बड़े सफ़र छोटे अक्षरों से शुरू होते हैं। चलिए शुरू करें।','تبدأ الرحلات الكبيرة بحروف صغيرة. لنبدأ رحلتك.','বড় যাত্রা ছোট অক্ষর দিয়ে শুরু হয়। চলুন শুরু করি।','Los grandes viajes empiezan con letras pequeñas. Empecemos el tuyo.'),
 start:text('Let’s begin','शुरू करें','لنبدأ','শুরু করুন','Empecemos'), continue:text('Continue learning','पढ़ना जारी रखें','تابع التعلّم','শেখা চালিয়ে যান','Seguir aprendiendo'), streak:text('Day streak','लगातार दिन','أيام متتالية','দিনের ধারা','Días seguidos'), xp:text('Total XP','कुल XP','إجمالي XP','মোট XP','XP total'), level:text('Level','स्तर','المستوى','স্তর','Nivel'), beginner:text('Beginner','शुरुआती','مبتدئ','নবীন','Principiante'), intermediate:text('Intermediate','मध्यम','متوسط','মধ্যবর্তী','Intermedio'), expert:text('Expert','विशेषज्ञ','متقدم','দক্ষ','Experto'),
 journey:text('Your learning path','आपकी सीखने की राह','مسار تعلّمك','আপনার শেখার পথ','Tu camino de aprendizaje'), journeySub:text('One day, one small win. You’ve got this.','हर दिन एक छोटी जीत। आप कर सकते हैं।','كل يوم، إنجاز صغير. أنت قادر.','প্রতিদিন একটি ছোট জয়। আপনি পারবেন।','Un día, un pequeño logro. Tú puedes.'), day:text('Day','दिन','اليوم','দিন','Día'), week:text('Week','सप्ताह','الأسبوع','সপ্তাহ','Semana'), letters:text('Meet your first letters','अपने पहले अक्षर सीखें','تعرّف على حروفك الأولى','প্রথম অক্ষরগুলো শিখুন','Tus primeras letras'), sounds:text('Letters & sounds','अक्षर और आवाज़ें','الحروف والأصوات','অক্ষর ও ধ্বনি','Letras y sonidos'), soon:text('Coming soon','जल्द आ रहा है','قريبًا','শীঘ্রই আসছে','Próximamente'), locked:text('Locked','बंद','مقفل','বন্ধ','Bloqueado'), complete:text('Completed','पूरा हुआ','مكتمل','সম্পন্ন','Completado'),
 alifSays:text('A little practice goes a long way! I’m right here with you.','थोड़ा अभ्यास बहुत काम आता है! मैं आपके साथ हूँ।','القليل من التدريب يصنع فرقًا! أنا هنا معك.','অল্প অনুশীলন অনেক কাজে দেয়! আমি আপনার পাশে আছি।','¡Un poco de práctica ayuda mucho! Estoy aquí contigo.'), friend:text('Your learning buddy','आपका सीखने का साथी','صديقك في التعلّم','আপনার শেখার বন্ধু','Tu compañero de aprendizaje'), daily:text('A little extra practice','थोड़ा और अभ्यास','تدريب إضافي بسيط','আরও একটু অনুশীলন','Un poco más de práctica'),
 readSub:text('Find your voice, one word at a time.','एक-एक शब्द पढ़ना सीखें।','اكتشف صوتك، كلمة بكلمة.','একটি করে শব্দ পড়ুন।','Encuentra tu voz, palabra a palabra.'), writeSub:text('Little letters, made by you.','अपने हाथों से अक्षर लिखें।','حروف صغيرة، تكتبها أنت.','নিজের হাতে অক্ষর লিখুন।','Pequeñas letras, hechas por ti.'), weekly:text('Your weekly goal','आपका साप्ताहिक लक्ष्य','هدفك الأسبوعي','আপনার সাপ্তাহিক লক্ষ্য','Tu meta semanal'), weeklySub:text('Complete 5 lessons this week','इस सप्ताह 5 पाठ पूरे करें','أكمل ٥ دروس هذا الأسبوع','এই সপ্তাহে ৫টি পাঠ শেষ করুন','Completa 5 lecciones esta semana'), lessons:text('lessons','पाठ','دروس','পাঠ','lecciones'), firstBadge:text('First steps','पहला कदम','الخطوات الأولى','প্রথম পদক্ষেপ','Primeros pasos'), badgeHint:text('Finish your first lesson to earn this badge.','पहला पाठ पूरा करके यह बैज पाएँ।','أكمل درسك الأول لتحصل على هذه الشارة.','প্রথম পাঠ শেষ করে এই ব্যাজ অর্জন করুন।','Completa tu primera lección para ganar esta insignia.'),
 languageTitle:text('What language do you speak?','आप कौन-सी भाषा बोलते हैं?','ما اللغة التي تتحدثها؟','আপনি কোন ভাষায় কথা বলেন?','¿Qué idioma hablas?'), languageSub:text('I’ll guide you in your language. We’ll learn Urdu together.','मैं आपकी भाषा में समझाऊँगा। हम साथ उर्दू सीखेंगे।','سأرشدك بلغتك. سنتعلّم الأردية معًا.','আমি আপনার ভাষায় সাহায্য করব। একসঙ্গে উর্দু শিখব।','Te guiaré en tu idioma. Aprenderemos urdu juntos.'), next:text('Continue','आगे बढ़ें','متابعة','চালিয়ে যান','Continuar'), skip:text('Start as a beginner','शुरुआती स्तर से शुरू करें','ابدأ كمبتدئ','নবীন হিসেবে শুরু করুন','Empezar como principiante'), placement:text('Find your starting point','अपना शुरुआती स्तर जानें','اعثر على نقطة بدايتك','শুরুর স্তর খুঁজুন','Encuentra tu punto de partida'), placementSub:text('Six little questions. No pressure, just a place to start.','छह छोटे सवाल। चिंता नहीं, बस शुरुआत तय करें।','ستة أسئلة بسيطة. بلا ضغط، فقط نقطة بداية.','ছয়টি ছোট প্রশ্ন। কোনো চাপ নেই।','Seis pequeñas preguntas. Sin presión, solo un punto de partida.'), question:text('Question','सवाल','سؤال','প্রশ্ন','Pregunta'), result:text('Your journey starts here!','आपका सफ़र यहाँ से शुरू होता है!','رحلتك تبدأ هنا!','আপনার যাত্রা এখানেই শুরু!','¡Tu viaje empieza aquí!'), resultSub:text('Your starting level is','आपका शुरुआती स्तर है','مستواك الأول هو','আপনার শুরুর স্তর','Tu nivel inicial es'),
 listen:text('Listen','सुनें','استمع','শুনুন','Escuchar'), reveal:text('Reveal the meaning','अर्थ देखें','اكشف المعنى','অর্থ দেখুন','Ver el significado'), check:text('Check your answer','जवाब जाँचें','تحقّق من إجابتك','উত্তর যাচাই করুন','Comprueba tu respuesta'), correct:text('Wonderful! That’s right.','बहुत अच्छा! सही जवाब।','رائع! إجابة صحيحة.','চমৎকার! সঠিক উত্তর।','¡Genial! Es correcto.'), wrong:text('Not quite. Listen and try once more.','अभी सही नहीं। सुनें और फिर कोशिश करें।','ليس تمامًا. استمع وحاول مرة أخرى.','ঠিক হয়নি। শুনে আবার চেষ্টা করুন।','No del todo. Escucha e inténtalo otra vez.'), lessonDone:text('Look at you go!','बहुत बढ़िया प्रगति!','يا له من تقدّم!','দারুণ এগিয়েছেন!','¡Mira cómo avanzas!'), earned:text('You earned','आपने कमाए','لقد كسبت','আপনি অর্জন করেছেন','Has ganado'), back:text('Back to my path','अपनी राह पर लौटें','العودة إلى مساري','পথে ফিরে যান','Volver a mi camino'),
 mic:text('Start reading','पढ़ना शुरू करें','ابدأ القراءة','পড়া শুরু করুন','Empezar a leer'), stop:text('Stop recording','रिकॉर्डिंग रोकें','أوقف التسجيل','রেকর্ডিং বন্ধ করুন','Detener grabación'), retry:text('Try again','फिर कोशिश करें','حاول مجددًا','আবার চেষ্টা করুন','Intentar de nuevo'), unsupported:text('Your browser doesn’t support Urdu speech recognition. Try Chrome on a supported device. You can still listen to every word.','आपका ब्राउज़र उर्दू आवाज़ पहचान नहीं करता। किसी समर्थित डिवाइस पर Chrome आज़माएँ। आप हर शब्द सुन सकते हैं।','متصفحك لا يدعم التعرّف على الكلام بالأردية. جرّب Chrome على جهاز مدعوم. يمكنك الاستماع إلى كل كلمة.','আপনার ব্রাউজার উর্দু কথা শনাক্ত করতে পারে না। সমর্থিত ডিভাইসে Chrome চেষ্টা করুন। প্রতিটি শব্দ শুনতে পারেন।','Tu navegador no admite reconocimiento de urdu. Prueba Chrome en un dispositivo compatible. Puedes escuchar cada palabra.'), speechError:text('We couldn’t hear you. Check microphone permission and your connection, then try again.','हम सुन नहीं पाए। माइक की अनुमति और इंटरनेट जाँचें, फिर कोशिश करें।','لم نتمكّن من سماعك. تحقّق من إذن الميكروفون والاتصال ثم حاول مجددًا.','শোনা যায়নি। মাইকের অনুমতি ও সংযোগ দেখে আবার চেষ্টা করুন।','No pudimos oírte. Revisa el permiso del micrófono y la conexión e inténtalo de nuevo.'), listening:text('I’m listening…','मैं सुन रहा हूँ…','أنا أستمع…','আমি শুনছি…','Te escucho…'), wordsCorrect:text('words correct','शब्द सही','كلمات صحيحة','শব্দ সঠিক','palabras correctas'), extra:text('Extra words','अतिरिक्त शब्द','كلمات إضافية','অতিরিক্ত শব্দ','Palabras extra'), noVoice:text('No Urdu or Arabic voice is installed on this device. Add a voice in your device’s speech settings.','इस डिवाइस पर उर्दू या अरबी आवाज़ नहीं है। डिवाइस की वाणी सेटिंग में आवाज़ जोड़ें।','لا يوجد صوت أردي أو عربي على هذا الجهاز. أضف صوتًا في إعدادات الكلام.','এই ডিভাইসে উর্দু বা আরবি কণ্ঠ নেই। ডিভাইসের স্পিচ সেটিংসে যোগ করুন।','No hay voz urdu ni árabe instalada. Añade una en los ajustes de voz del dispositivo.'),
 selectLetters:text('Choose your letters','अक्षर चुनें','اختر حروفك','অক্ষর বাছুন','Elige tus letras'), print:text('Print worksheet','वर्कशीट प्रिंट करें','اطبع ورقة التدريب','অনুশীলনপত্র প্রিন্ট করুন','Imprimir hoja'), trace:text('Trace, then write on your own','पहले ऊपर लिखें, फिर खुद लिखें','تتبّع الحروف ثم اكتب بنفسك','প্রথমে অনুসরণ করুন, তারপর নিজে লিখুন','Repasa y luego escribe por tu cuenta'), name:text('Name','नाम','الاسم','নাম','Nombre'), date:text('Date','तारीख़','التاريخ','তারিখ','Fecha'), badges:text('Your badges','आपके बैज','شاراتك','আপনার ব্যাজ','Tus insignias'), history:text('Streak history','लगातार अभ्यास का इतिहास','سجلّ أيام التعلّم','শেখার ইতিহাস','Historial de rachas'), settings:text('Native language','आपकी भाषा','لغتك الأم','আপনার ভাষা','Idioma nativo'), weekBadge:text('Week one explorer','पहले सप्ताह के खोजी','مستكشف الأسبوع الأول','প্রথম সপ্তাহের অভিযাত্রী','Explorador de la primera semana'), streakBadge:text('Seven-day spark','सात दिन की चमक','شرارة سبعة أيام','সাত দিনের আলো','Chispa de siete días'), badgeLocked:text('Keep learning to unlock','सीखते रहें और पाएँ','تابع التعلّم لفتحها','শিখে যান, অর্জন করুন','Sigue aprendiendo para desbloquear'), saved:text('Your progress stays on this device','आपकी प्रगति इस डिवाइस पर रहती है','يبقى تقدّمك على هذا الجهاز','আপনার অগ্রগতি এই ডিভাইসে থাকে','Tu progreso se guarda en este dispositivo'), goal:text('Small steps. Real progress.','छोटे कदम। असली प्रगति।','خطوات صغيرة. تقدّم حقيقي.','ছোট পদক্ষেপ। সত্যিকারের উন্নতি।','Pequeños pasos. Progreso real.'), minutes:text('min','मिनट','دقائق','মিনিট','min'), voiceNote:text('Speech recognition needs an internet connection.','आवाज़ पहचान के लिए इंटरनेट चाहिए।','التعرّف على الكلام يحتاج اتصالًا بالإنترنت.','কথা শনাক্ত করতে ইন্টারনেট দরকার।','El reconocimiento de voz necesita internet.'), dayLimit:text('Finish the previous lesson to unlock this day.','इस दिन को खोलने के लिए पिछला पाठ पूरा करें।','أكمل الدرس السابق لفتح هذا اليوم.','এই দিন খুলতে আগের পাঠ শেষ করুন।','Completa la lección anterior para desbloquear este día.'),
};
export type Letter = {glyph:string;name:string;sound:string;word:string;roman:string;meaning:Text;};
export const letters:Letter[] = [
 {glyph:'ا',name:'Alif',sound:'a / ā',word:'انار',roman:'anār',meaning:text('Pomegranate','अनार','رُمّان','ডালিম','Granada')},
 {glyph:'ب',name:'Be',sound:'b',word:'بکری',roman:'bakrī',meaning:text('Goat','बकरी','ماعز','ছাগল','Cabra')},
 {glyph:'پ',name:'Pe',sound:'p',word:'پانی',roman:'pānī',meaning:text('Water','पानी','ماء','পানি','Agua')},
 {glyph:'ت',name:'Te',sound:'t',word:'تارا',roman:'tārā',meaning:text('Star','तारा','نجمة','তারা','Estrella')},
 {glyph:'ٹ',name:'Tte',sound:'ṭ',word:'ٹوپی',roman:'ṭopī',meaning:text('Hat','टोपी','قبعة','টুপি','Sombrero')},
 {glyph:'ث',name:'Se',sound:'s',word:'ثمر',roman:'samar',meaning:text('Fruit / result','फल / परिणाम','ثمرة / نتيجة','ফল / ফলাফল','Fruto / resultado')},
 {glyph:'ج',name:'Jeem',sound:'j',word:'جہاز',roman:'jahāz',meaning:text('Ship / airplane','जहाज़','سفينة / طائرة','জাহাজ / বিমান','Barco / avión')},
 {glyph:'چ',name:'Che',sound:'ch',word:'چاند',roman:'chānd',meaning:text('Moon','चाँद','قمر','চাঁদ','Luna')},
 {glyph:'ح',name:'Baṛī he',sound:'h',word:'حلوہ',roman:'halwā',meaning:text('Sweet','मिठाई','حلوى','মিষ্টি','Dulce')},
 {glyph:'خ',name:'Khe',sound:'kh',word:'خرگوش',roman:'khargosh',meaning:text('Rabbit','खरगोश','أرنب','খরগোশ','Conejo')},
 {glyph:'د',name:'Daal',sound:'d',word:'دروازہ',roman:'darwāza',meaning:text('Door','दरवाज़ा','باب','দরজা','Puerta')},
 {glyph:'ڈ',name:'Ddaal',sound:'ḍ',word:'ڈبہ',roman:'ḍibba',meaning:text('Box','डिब्बा','صندوق','বাক্স','Caja')},
 {glyph:'ذ',name:'Zaal',sound:'z',word:'ذرہ',roman:'zarra',meaning:text('Particle','कण','ذرّة','কণা','Partícula')},
 {glyph:'ر',name:'Re',sound:'r',word:'روٹی',roman:'roṭī',meaning:text('Bread','रोटी','خبز','রুটি','Pan')},
 {glyph:'ڑ',name:'Rre',sound:'ṛ',word:'پہاڑ',roman:'pahāṛ',meaning:text('Mountain','पहाड़','جبل','পাহাড়','Montaña')},
 {glyph:'ز',name:'Ze',sound:'z',word:'زمین',roman:'zamīn',meaning:text('Land','ज़मीन','أرض','জমি','Tierra')},
 {glyph:'ژ',name:'Zhe',sound:'zh',word:'ژالہ',roman:'zhāla',meaning:text('Hail','ओले','بَرَد','শিলাবৃষ্টি','Granizo')},
 {glyph:'س',name:'Seen',sound:'s',word:'سیب',roman:'seb',meaning:text('Apple','सेब','تفاحة','আপেল','Manzana')},
 {glyph:'ش',name:'Sheen',sound:'sh',word:'شیر',roman:'sher',meaning:text('Lion','शेर','أسد','সিংহ','León')},
 {glyph:'ص',name:'Suaad',sound:'s',word:'صابن',roman:'sābun',meaning:text('Soap','साबुन','صابون','সাবান','Jabón')},
 {glyph:'ض',name:'Zuaad',sound:'z',word:'ضرب',roman:'zarb',meaning:text('Strike','वार','ضرب','আঘাত','Golpe')},
 {glyph:'ط',name:'Toe',sound:'t',word:'طوطا',roman:'ṭoṭā',meaning:text('Parrot','तोता','ببغاء','টিয়া','Loro')},
 {glyph:'ظ',name:'Zoe',sound:'z',word:'ظرف',roman:'zarf',meaning:text('Vessel','बर्तन','وعاء','পাত্র','Recipiente')},
 {glyph:'ع',name:'Ain',sound:'ʿa',word:'عینک',roman:'ainak',meaning:text('Glasses','चश्मा','نظارة','চশমা','Gafas')},
 {glyph:'غ',name:'Ghain',sound:'gh',word:'غبارہ',roman:'ghubāra',meaning:text('Balloon','ग़ुब्बारा','بالون','বেলুন','Globo')},
 {glyph:'ف',name:'Fe',sound:'f',word:'فیل',roman:'fīl',meaning:text('Elephant','हाथी','فيل','হাতি','Elefante')},
 {glyph:'ق',name:'Qaaf',sound:'q',word:'قلم',roman:'qalam',meaning:text('Pen','क़लम','قلم','কলম','Bolígrafo')},
 {glyph:'ک',name:'Kaaf',sound:'k',word:'کتاب',roman:'kitāb',meaning:text('Book','किताब','كتاب','বই','Libro')},
 {glyph:'گ',name:'Gaaf',sound:'g',word:'گھر',roman:'ghar',meaning:text('House','घर','منزل','ঘর','Casa')},
 {glyph:'ل',name:'Laam',sound:'l',word:'لڑکا',roman:'laṛkā',meaning:text('Boy','लड़का','ولد','ছেলে','Niño')},
 {glyph:'م',name:'Meem',sound:'m',word:'مچھلی',roman:'machhlī',meaning:text('Fish','मछली','سمكة','মাছ','Pez')},
 {glyph:'ن',name:'Noon',sound:'n',word:'ناک',roman:'nāk',meaning:text('Nose','नाक','أنف','নাক','Nariz')},
 {glyph:'و',name:'Wao',sound:'w / o',word:'وقت',roman:'waqt',meaning:text('Time','वक़्त','وقت','সময়','Tiempo')},
 {glyph:'ہ',name:'He',sound:'h',word:'ہاتھی',roman:'hāthī',meaning:text('Elephant','हाथी','فيل','হাতি','Elefante')},
 {glyph:'ھ',name:'Do-chashmi he',sound:'h',word:'دودھ',roman:'dūdh',meaning:text('Milk','दूध','حليب','দুধ','Leche')},
 {glyph:'ی',name:'Ye',sound:'y',word:'یاد',roman:'yād',meaning:text('Memory','याद','ذاكرة','স্মৃতি','Recuerdo')},
 {glyph:'ے',name:'Baṛī ye',sound:'e',word:'چائے',roman:'chāy',meaning:text('Tea','चाय','شاي','চা','Té')},
 {glyph:'ں',name:'Noon ghunna',sound:'ñ',word:'ماں',roman:'māñ',meaning:text('Mother','माँ','أمّ','মা','Madre')},
];
export const lessons = [[0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[24,25,26],[27,28,29],[30,31,32],[33,34,35],[36,37]];
export const sentences = [
 {urdu:'یہ میرا گھر ہے۔',roman:'Yeh merā ghar hai.',meaning:text('This is my home.','यह मेरा घर है।','هذا بيتي.','এটি আমার বাড়ি।','Esta es mi casa.')},
 {urdu:'میں پانی پیتا ہوں۔',roman:'Main pānī pītā hūn.',meaning:text('I drink water.','मैं पानी पीता हूँ।','أنا أشرب الماء.','আমি পানি পান করি।','Yo bebo agua.')},
 {urdu:'آج موسم اچھا ہے۔',roman:'Āj mausam achchhā hai.',meaning:text('The weather is nice today.','आज मौसम अच्छा है।','الطقس جميل اليوم.','আজ আবহাওয়া সুন্দর।','Hoy hace buen tiempo.')},
 {urdu:'یہ ایک خوبصورت کتاب ہے۔',roman:'Yeh ek khūbsūrat kitāb hai.',meaning:text('This is a beautiful book.','यह एक सुंदर किताब है।','هذا كتاب جميل.','এটি একটি সুন্দর বই।','Este es un libro bonito.')},
];
export const questions = [
 {prompt:text('Which letter is Alif?','अलिफ़ कौन-सा अक्षर है?','أيّ حرف هو ألف؟','আলিফ কোন অক্ষর?','¿Qué letra es Alif?'),options:['ب','ا','ج'],answer:1},
 {prompt:text('Which letter makes the “b” sound?','“b” की आवाज़ कौन-सा अक्षर बनाता है?','أيّ حرف يصدر صوت «b»؟','কোন অক্ষরের ধ্বনি “b”?','¿Qué letra tiene el sonido «b»?'),options:['پ','ت','ب'],answer:2},
 {prompt:text('What is the sound of پ?','پ की आवाज़ क्या है?','ما صوت پ؟','پ এর ধ্বনি কী?','¿Qué sonido tiene پ?'),options:['p','j','t'],answer:0},
 {prompt:text('Which letter is Jeem?','जीम कौन-सा अक्षर है?','أيّ حرف هو جيم؟','জিম কোন অক্ষর?','¿Qué letra es Jeem?'),options:['ث','ج','ٹ'],answer:1},
 {prompt:text('How do you read پانی?','پانی कैसे पढ़ते हैं?','كيف تقرأ پانی؟','پانی কীভাবে পড়বেন?','¿Cómo se lee پانی?'),options:['pānī','kitāb','ghar'],answer:0},
 {prompt:text('How do you read کتاب?','کتاب कैसे पढ़ते हैं?','كيف تقرأ کتاب؟','کتاب কীভাবে পড়বেন?','¿Cómo se lee کتاب?'),options:['pānī','ghar','kitāb'],answer:2},
];
export type Progress = {language:Language|null;placement:'beginner'|'intermediate'|'expert'|null;xp:number;completed:number[];tasks:string[];dates:string[];avatar?:AvatarId;};
export const initialProgress:Progress = {language:null,placement:null,xp:0,completed:[],tasks:[],dates:[]};
// Device data is untrusted and may come from an older version of the app.
export function normalizeProgress(value:unknown):Progress {
 const p:Partial<Record<keyof Progress,unknown>>=value && typeof value==='object'?value as Partial<Record<keyof Progress,unknown>>:{};
 const language=languages.find(item=>item.id===p.language)?.id??null;
 const placement=p.placement==='beginner'||p.placement==='intermediate'||p.placement==='expert'?p.placement:null;
 const xp=typeof p.xp==='number'&&Number.isFinite(p.xp)&&p.xp>=0?p.xp:0;
 const completed=Array.isArray(p.completed)?p.completed.filter((day):day is number=>typeof day==='number'&&Number.isInteger(day)&&day>=1&&day<=lessons.length):[];
 const tasks=Array.isArray(p.tasks)?p.tasks.filter((task):task is string=>typeof task==='string'):[];
 const dates=Array.isArray(p.dates)?p.dates.filter((date):date is string=>typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&localDate(new Date(`${date}T12:00:00`))===date):[];
 const avatar=validAvatar(p.avatar);
 return {language,placement,xp,completed:[...new Set(completed)],tasks:[...new Set(tasks)],dates:[...new Set(dates)],...(avatar?{avatar}:{})};
}
export function translate(value:Partial<Text>|null|undefined,language:Language):string {return value?.[language]??(language==='ur'&&value?.en?instructionUrdu(value.en):undefined)??value?.en??'';}
export function placementLevel(score:number):NonNullable<Progress['placement']> {return score<=2?'beginner':score<=4?'intermediate':'expert';}
export function localDate(date = new Date()) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function streak(dates:string[],today=new Date()) {
 let count=0; const d=new Date(today); if(!dates.includes(localDate(d))) d.setDate(d.getDate()-1);
 while(dates.includes(localDate(d))) {count++; d.setDate(d.getDate()-1);} return count;
}
export function award(p:Progress,task:string,amount:number,day?:number,date=localDate()):Progress {
 const fresh=!p.tasks.includes(task); const isLesson=day!==undefined;
 return {...p,xp:p.xp+(fresh?amount:0),tasks:fresh?[...p.tasks,task]:p.tasks,completed:isLesson&&!p.completed.includes(day)?[...p.completed,day]:p.completed,dates:isLesson&&!p.dates.includes(date)?[...p.dates,date]:p.dates};
}
export function levelFor(xp:number) {return Math.floor(xp/100)+1;}
export function unlocked(day:number,p:Progress) {return day<=lessons.length && (day===1||p.completed.includes(day-1));}
export function normalizeWords(s:string) {return s.normalize('NFC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[^\p{L}\p{N}\s]/gu,'').trim().split(/\s+/).filter(Boolean);}
export function getLetter(index:number):Letter {const item=letters[index];if(!item)throw new Error('Unknown letter');return item;}
export function getQuestion(index:number) {const item=questions[index];if(!item)throw new Error('Unknown question');return item;}
export function getSentence(index:number) {const item=sentences[index];if(!item)throw new Error('Unknown sentence');return item;}
export function compareWords(expected:string,spoken:string) {
 const a=normalizeWords(expected),b=normalizeWords(spoken); const dp=Array.from({length:a.length+1},()=>Array<number>(b.length+1).fill(0));
 const value=(i:number,j:number)=>dp[i]?.[j]??0;
 for(let i=a.length-1;i>=0;i--){const row=dp[i];if(!row)continue;for(let j=b.length-1;j>=0;j--)row[j]=a[i]===b[j]?1+value(i+1,j+1):Math.max(value(i+1,j),value(i,j+1));}
 const correct=Array<boolean>(a.length).fill(false),extras:string[]=[];let i=0,j=0;
 while(i<a.length&&j<b.length){if(a[i]===b[j]){correct[i]=true;i++;j++;}else if(value(i+1,j)>=value(i,j+1))i++;else extras.push(b[j++]??'');} while(j<b.length)extras.push(b[j++]??'');
 return {words:a,correct,extras,score:correct.filter(Boolean).length,total:a.length};
}
