import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  Search,
  Filter,
  Shield,
  UserPlus,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Lock,
  Unlock,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  BookOpen,
  Home,
  Phone,
  Facebook,
  Image as ImageIcon,
  AlertCircle,
  SlidersHorizontal,
  RefreshCw,
  Trash2,
  Share2,
  BadgeCheck,
  Clock,
  X,
  Info,
  MessageSquare,
  Send,
  KeyRound,
  Inbox
} from 'lucide-react';

// ============================================================================
// القوائم الثابتة المطابقة لملف الـ PDF
// ============================================================================

const STORAGE_KEY = 'mithaq_wad_submissions_v3';
const MESSAGES_STORAGE_KEY = 'mithaq_wad_messages_v1';
const LAST_SUBMIT_DATE_KEY = 'mithaq_wad_last_form_submit_date';
const LAST_MSG_DATE_KEY = 'mithaq_wad_last_msg_submit_date';

const UNIVERSITIES = [
  'جامعة الأزهر', 'جامعة القاهرة', 'جامعة عين شمس', 'جامعة الإسكندرية', 'جامعة المنصورة',
  'جامعة أسيوط', 'جامعة طنطا', 'جامعة الزقازيق', 'جامعة حلوان', 'جامعة المنيا',
  'جامعة المنوفية', 'جامعة قناة السويس', 'جامعة جنوب الوادي', 'جامعة بني سويف',
  'جامعة الفيوم', 'جامعة بنها', 'جامعة كفر الشيخ', 'جامعة سوهاج', 'جامعة بورسعيد',
  'جامعة دمنهور', 'جامعة أسوان', 'جامعة دمياط', 'جامعة السويس', 'جامعة مدينة السادات',
  'جامعة العريش', 'جامعة الوادي الجديد', 'جامعة مطروح', 'جامعة الأقصر', 'جامعة البحر الأحمر',
  '(AUC) الجامعة الأمريكية بالقاهرة', '(GUC) الجامعة الألمانية بالقاهرة', '(BUE) الجامعة البريطانية',
  '(MUST) جامعة مصر للعلوم والتكنولوجيا', '(O6U) جامعة 6 أكتوبر', '(MSA) جامعة أكتوبر للعلوم الحديثة',
  '(FUE) جامعة المستقبل', 'جامعة النيل', '(MIU) جامعة مصر الدولية', 'الجامعة المصرية الروسية',
  'الأكاديمية العربية للعلوم والتكنولوجيا', 'جامعة أخرى'
];

const FACULTIES = [
  'كلية الطب البشري', 'كلية طب الأسنان', 'كلية الصيدلة', 'كلية العلاج الطبيعي', 'كلية الطب البيطري', 'كلية التمريض',
  'كلية الهندسة', 'كلية الحاسبات والذكاء الاصطناعي', 'كلية التخطيط العمراني', 'كلية الفنون الجميلة', 'كلية الفنون التطبيقية',
  'كلية العلوم', 'كلية الزراعة', 'كلية الاقتصاد والعلوم السياسية', 'كلية الإعلام', 'كلية الألسن', 'كلية اللغات والترجمة', 'كلية الآثار',
  'كلية التربية', 'كلية الآداب', 'كلية الحقوق', 'كلية التجارة / إدارة الأعمال', 'كلية دار العلوم', 'كلية الشريعة والقانون',
  'كلية أصول الدين', 'كلية الدراسات الإسلامية والعربية', 'كلية الدعوة الإسلامية', 'كلية القرآن الكريم',
  'كلية التربية الرياضية', 'كلية التربية النوعية', 'كلية التربية للطفولة المبكرة', 'كلية السياحة والفنادق', 'كلية الخدمة الاجتماعية',
  'معهد فني', 'معهد هندسي', 'أخرى'
];

const GOVERNORATES = [
  'القاهرة', 'الجيزة', 'القليوبية', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'الغربية', 'المنوفية',
  'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء', 'جنوب سيناء',
  'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر',
  'الوادي الجديد', 'مطروح'
];

// رموز المحافظات لتوليد كود الاستمارة المعتمدة الذكي
const GOV_CODES = {
  'القاهرة': 'CAI',
  'الجيزة': 'GIZ',
  'القليوبية': 'QLY',
  'الإسكندرية': 'ALX',
  'الدقهلية': 'DKH',
  'الشرقية': 'SHQ',
  'الغربية': 'GHR',
  'المنوفية': 'MNF',
  'البحيرة': 'BHR',
  'كفر الشيخ': 'KFS',
  'دمياط': 'DMT',
  'بورسعيد': 'PSD',
  'الإسماعيلية': 'ISM',
  'السويس': 'SUZ',
  'شمال سيناء': 'NSI',
  'جنوب سيناء': 'SSI',
  'الفيوم': 'FYM',
  'بني سويف': 'BNS',
  'المنيا': 'MNY',
  'أسيوط': 'ASY',
  'سوهاج': 'SOH',
  'قنا': 'QNA',
  'الأقصر': 'LXR',
  'أسوان': 'ASW',
  'البحر الأحمر': 'RSEA',
  'الوادي الجديد': 'WAD',
  'مطروح': 'MTR'
};

const DEGREE_TYPES = ['بكالوريوس / ليسانس', 'ماجستير', 'دكتوراه', 'دبلومة دراسات عليا'];

// دالة مساعدة لحساب العمر التقريبي من تاريخ الميلاد
function calculateAgeFromDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length < 1) return null;
  const birthYear = parseInt(parts[0], 10);
  if (isNaN(birthYear) || birthYear < 1940 || birthYear > 2026) return null;
  return 2026 - birthYear;
}

// دالة توليد كود المراجعة (يظهر للمستخدم عند إرسال استمارة جديدة ليحتفظ به)
function generateTrackingCode() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `TRK-${randomNum}`;
}

// دالة توليد الكود الرسمي للاستمارة المعتمدة (يتضمن رمز المحافظة + النوع/الحالة + سنة الميلاد + رقم تسلسلي)
function generateApprovedCode(item, seqNumber = 101) {
  const isMale = item.q1_gender === 'عريس (ذكر)';
  const gov = isMale ? item.q27_maleBirthGov : item.q87_femaleBirthGov;
  const govCode = GOV_CODES[gov] || 'EGY';
  const genderChar = isMale ? 'M' : 'F';

  const status = isMale ? item.q6_maleMaritalStatus : item.q79_femaleMaritalStatus;
  let statusDigit = '1'; // أعزب / عزباء
  if (status === 'مطلق' || status === 'مطلقة') statusDigit = '2';
  else if (status === 'أرمل' || status === 'أرملة') statusDigit = '3';
  else if (status === 'متزوج' || status === 'منفصل بدون طلاق') statusDigit = '4';

  const birthDate = isMale ? item.q7_maleBirthDate : item.q80_femaleBirthDate;
  const birthYearShort =
    birthDate && birthDate.length >= 4 ? birthDate.substring(2, 4) : '99';

  return `${govCode}-${genderChar}${statusDigit}${birthYearShort}-${seqNumber}`;
}

// بطاقة توضيحية مرسومة بـ SVG لمثال إخفاء الرقم القومي (مطابقة للصورة التوضيحية في الـ PDF)
const IdSampleIllustration = ({ side = 'front' }) => (
  <div className="my-2 p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-3 text-xs text-amber-900">
    <div className="w-48 h-28 bg-gradient-to-br from-stone-100 to-amber-100 rounded-lg border-2 border-stone-300 p-2 relative shadow-sm shrink-0 select-none">
      {side === 'front' ? (
        <>
          <div className="text-[9px] font-bold text-center text-stone-700 border-b border-stone-300 pb-0.5 mb-1">
            جمهورية مصر العربية - بطاقة تحقيق الشخصية
          </div>
          <div className="flex justify-between items-start gap-1">
            <div className="w-10 h-12 bg-stone-300 rounded border border-stone-400 flex items-center justify-center text-[8px] text-stone-600">
              صورة
            </div>
            <div className="flex-1 text-[8px] space-y-0.5 text-right text-stone-700">
              <div>الإسم الأول: أحمد</div>
              <div>باقي الاسم: علي حسن محمود</div>
              <div>العنوان: 15 شارع النيل، الدقي</div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between bg-white/80 px-1.5 py-0.5 rounded border border-stone-300">
            <span className="font-mono text-[9px] font-bold text-emerald-800 tracking-wider">290052</span>
            <span className="w-16 h-2.5 bg-sky-600 rounded-sm inline-block" title="مخفي"></span>
            <span className="text-[7px] text-stone-500">14 رقم</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center text-[8px] text-stone-700 mb-1">
            <span className="font-mono font-bold">2023/05</span>
            <span className="w-12 h-2 bg-sky-600 rounded-sm inline-block"></span>
            <span>رقم البطاقة</span>
          </div>
          <div className="text-[8px] text-right text-stone-700 space-y-0.5 mb-2">
            <div>المهنة: مهندس برمجيات</div>
            <div>ذكر - مسلم - متزوج</div>
          </div>
          <div className="h-6 bg-stone-800/80 rounded-sm w-full flex items-center justify-center text-[7px] text-stone-200 tracking-widest">
            ||||||||||||||||||||||||||||||
          </div>
        </>
      )}
    </div>
    <div className="space-y-1 text-right">
      <p className="font-bold text-amber-950 flex items-center gap-1.5">
        <Shield className="w-4 h-4 text-amber-600 shrink-0" />
        توضيح هام لحماية الخصوصية ({side === 'front' ? 'الوجه الأمامي' : 'الوجه الخلفي'}):
      </p>
      <p className="text-stone-600 leading-relaxed">
        يرجى إخفاء باقي الرقم القومي وإظهار <strong>أول 6 أرقام فقط من اليسار</strong> (الخاصة بتاريخ الميلاد)، علماً بأن صور البطاقات سرية تماماً ولا يطلع عليها سوى الإدارة فقط لتوثيق الجدية.
      </p>
    </div>
  </div>
);

// ============================================================================
// بيانات تجريبية غنية للبحث والفلترة (تحتوي على كود المتابعة وكود الاعتماد بالمحافظة)
// ============================================================================

const INITIAL_SUBMISSIONS = [
  {
    id: 'GIZ-M195-101',
    trackingCode: 'TRK-482910',
    approvedCode: 'GIZ-M195-101',
    createdAt: '2026-10-20',
    status: 'معتمد',
    adminNotes: 'تم التحقق من البطاقة الشخصية والبيانات مطابقة.',
    q1_gender: 'عريس (ذكر)',
    q2_maleEduLevel: 'مؤهل جامعي (عالي)',
    q3_maleDegreeType: 'بكالوريوس / ليسانس',
    q4_maleUniversity: 'جامعة القاهرة',
    q5_maleFaculty: 'كلية الهندسة',
    q6_maleMaritalStatus: 'أعزب',
    q7_maleBirthDate: '1995-05-14',
    q8_maleWeight: '78',
    q9_maleHeight: '178',
    q10_maleSkinColor: 'قمحي',
    q11_maleHygiene: 'أحرص عليها دائمًا',
    q12_maleBeard: 'لحية خفيفة تأخذ منها',
    q13_maleSport: 'نعم',
    q14_maleDiseases: 'لا يوجد بفضل الله',
    q15_maleKidsGoal: 'نعم',
    q16_maleActualJob: 'مهندس برمجيات بشركة دولية',
    q17_maleJobType: ['خاص'],
    q18_maleJobNotes: 'العمل مستقر بنظام هجين',
    q19_maleIncome: 'ميسور',
    q20_malePrevEngaged: 'لم يسبق',
    q21_malePolygamyDesire: 'لا',
    q22_maleFatherJob: 'معاش (مدير مدرسة سابقاً)',
    q23_maleMotherJob: 'ربة منزل',
    q24_maleBrothersCount: '2',
    q25_maleSistersCount: '1',
    q26_maleSiblingsEdu: 'جميعهم مؤهلات عليا (طب وهندسة)',
    q27_maleBirthGov: 'الجيزة',
    q28_maleCurrentResidence: 'الجيزة - المهندسين',
    q29_maleDistrictName: 'المهندسين',
    q30_maleDistrictType: 'راقي',
    q31_maleMaritalHome: 'شقة تمليك بمدينة 6 أكتوبر',
    q32_maleHousingSystem: 'تمليك منفصل',
    q33_maleReligiosity: 'متدين',
    q34_malePrayer: 'معظم الصلوات في المسجد',
    q35_maleSmoking: 'لا',
    q36_maleQuran: '5 أجزاء مع التجويد',
    q37_maleMovies: 'لا',
    q38_maleSongs: 'لا',
    q39_malePreachers: 'الشيخ محمد الغزالي، د. راغب السرجاني، الشيخ الشعراوي',
    q40_maleIslamicStudy: 'درست أساسيات الفقه والتجويد ولدي نية للاستزادة',
    q41_maleAboutSelf: 'هادئ الطباع، أحب الحياة الأسرية المستقرة، أحترم شريكة الحياة وأقدر التفاهم والرحمة.',
    q42_maleBasicNotes: 'جاهز للزواج خلال 6 أشهر',
    q63_malePartnerSpecs: 'ذات خلق ودين، هادئة، تهتم ببيتها وأسرتها',
    q64_malePartnerAge: 'من 22 إلى 28 سنة',
    q65_malePartnerSkin: 'بيضاء أو قمحية فاتحة',
    q66_malePartnerStatus: ['آنسة'],
    q67_maleAcceptDivorcedDadCustody: 'لا',
    q68_maleAcceptWithKids: 'لا',
    q69_maleAcceptOtherGov: 'القاهرة أو الجيزة أو القليوبية',
    q70_malePartnerHijabPref: 'كلاهما',
    q71_malePartnerEduPref: 'عالي',
    q72_malePartnerWorkPref: 'حسب الإتفاق',
    q73_maleQaymaPref: 'لا مانع (موافق علي أي منهما)',
    q74_malePartnerNotes: 'التيسير في الأمور المادية والتركيز على التوافق الفكري',
    q57_maleSender: 'أنت (العريس)',
    q141_maleIdFront: 'بطاقة_أمامية_موثقة_1001.jpg',
    q142_maleIdBack: 'بطاقة_خلفية_موثقة_1001.jpg',
    q143_maleSecretPhone: '01012345678',
    q144_maleSecretFb: 'https://facebook.com/ahmed.eng.1001',
    q145_malePersonalPhoto: 'صورة_شخصية_1001.jpg',
    q146_malePublishFb: 'نعم',
    q147_malePublishTelegram: 'نعم',
    q148_malePrevContact: 'لا',
    q149_maleFinalNotes: 'جزاكم الله خيراً على هذا العمل المبارك',
    q150_malePledge: true
  },
  {
    id: 'CAI-F199-102',
    trackingCode: 'TRK-593821',
    approvedCode: 'CAI-F199-102',
    createdAt: '2026-10-22',
    status: 'معتمد',
    adminNotes: 'استمارة مكتملة وولي الأمر على علم.',
    q1_gender: 'عروسة (أنثى)',
    q75_femaleEduLevel: 'مؤهل جامعي (عالي)',
    q76_femaleDegreeType: 'بكالوريوس / ليسانس',
    q77_femaleUniversity: 'جامعة الأزهر',
    q78_femaleFaculty: 'كلية الصيدلة',
    q79_femaleMaritalStatus: 'عزباء (بكر)',
    q80_femaleBirthDate: '1999-09-10',
    q81_femaleWeight: '60',
    q82_femaleHeight: '164',
    q83_femaleSkinColor: 'بيضاء',
    q84_femaleHygiene: 'أحرص عليها دائمًا',
    q85_femaleBeauty: 'جيد جدًا',
    q86_femaleDiseases: 'لا يوجد الحمد لله',
    q87_femaleBirthGov: 'القاهرة',
    q88_femaleCurrentResidence: 'القاهرة - مدينة نصر',
    q89_femaleDistrictName: 'الحي السابع - مدينة نصر',
    q90_femaleDistrictType: 'راقي',
    q91_femaleActualJob: 'صيدلانية',
    q92_femaleJobType: 'خاص',
    q93_femalePrevEngaged: 'خطوبة سابقة منذ عامين ولم يكتمل النصيب',
    q94_femaleAcceptMarriedMan: 'لا اقدر',
    q95_femaleKidsGoal: 'نعم',
    q96_femaleReligiosity: 'متدينة',
    q97_femalePrayer: 'أصلي جميع الفروض في وقتها',
    q98_femaleQuran: 'خاتمة للقرآن الكريم كاملاً بفضل الله',
    q99_femaleMovies: 'لا',
    q100_femaleSongs: 'لا',
    q101_femalePreachers: 'الشيخ ابن عثيمين، د. إياد قنيبي، د. عبد الرحمن ذاكر',
    q102_femaleIslamicStudy: 'درست بالأزهر الشريف وحصلت على إجازة في التجويد',
    q103_femaleHijabType: 'خمار إسلامي',
    q104_femaleNiqabReady: 'نعم',
    q105_femaleAboutSelf: 'طيبة القلب، محبة للعلم الشرعي والهدوء الأسري، أجيد إدارة شؤون المنزل والطهي.',
    q106_femaleGeneralNotes: 'أسرة مترابطة ومحافظة',
    q107_femalePartnerSpecs: 'رجل صالح يتقي الله، محافظ على صلاة الجماعة، كريم الأخلاق وهادئ الطباع',
    q108_femalePartnerAge: 'من 27 إلى 34 سنة',
    q109_femalePartnerEdu: 'عالي',
    q110_femalePartnerSkin: 'غير محدد',
    q111_femalePartnerStatus: ['أعزب', 'مطلق'],
    q112_femaleAcceptNoKids: 'نعم',
    q113_femaleAcceptHisCustody: 'لا',
    q114_femaleAcceptMomCustody: 'نعم',
    q115_femaleAcceptOtherGov: 'القاهرة أو الجيزة فقط',
    q116_femaleSpecialConditions: 'غير مدخن نهائياً، يفضل ملتحي أو يحترم السمت الإسلامي، سكن مستقل',
    q117_femaleQaymaPref: 'لا مانع (موافقون على أي منهما)',
    q118_femaleQaymaNotes: 'الأهل متفهمون ويبحثون عن الرجل الصالح أولاً',
    q119_femaleSender: 'أنتِ (العروسة)',
    q151_femaleSecretPhone: '01122334455',
    q152_femaleGuardianSecretPhone: '01099887766',
    q153_femaleSecretFb: 'https://facebook.com/mariam.pharma.1002',
    q154_femaleIdFront: 'بطاقة_عروسة_أمامية_1002.jpg',
    q155_femaleIdBack: 'بطاقة_عروسة_خلفية_1002.jpg',
    q156_femalePersonalPhoto: '',
    q157_femalePublishFb: 'نعم',
    q158_femalePublishTelegram: 'نعم',
    q159_femalePrevContact: 'لا',
    q160_femaleFinalNotes: 'لا يوجد',
    q161_femalePledge: true
  },
  {
    id: 'DKH-M289-103',
    trackingCode: 'TRK-714092',
    approvedCode: 'DKH-M289-103',
    createdAt: '2026-10-24',
    status: 'معتمد',
    adminNotes: 'تم مراجعة قسيمة الطلاق وبطاقة الأخ المرسل.',
    q1_gender: 'عريس (ذكر)',
    q2_maleEduLevel: 'مؤهل جامعي (عالي)',
    q3_maleDegreeType: 'ماجستير',
    q4_maleUniversity: 'جامعة المنصورة',
    q5_maleFaculty: 'كلية التجارة / إدارة الأعمال',
    q6_maleMaritalStatus: 'مطلق',
    q7_maleBirthDate: '1989-11-03',
    q8_maleWeight: '84',
    q9_maleHeight: '180',
    q10_maleSkinColor: 'فاتح',
    q11_maleHygiene: 'أحرص عليها دائمًا',
    q12_maleBeard: 'تارك اللحية سنة',
    q13_maleSport: 'إلى حد ما',
    q14_maleDiseases: 'لا يوجد',
    q15_maleKidsGoal: 'نعم',
    q16_maleActualJob: 'مدير مالي وإداري',
    q17_maleJobType: ['خاص', 'صاحب عمل'],
    q18_maleJobNotes: 'لدي مكتب محاسبة خاص بجانب الوظيفة',
    q19_maleIncome: 'عالي',
    q20_malePrevEngaged: 'زواج سابق دام سنتين',
    q21_malePolygamyDesire: 'لا',
    q22_maleFatherJob: 'تاجر',
    q23_maleMotherJob: 'معلمة بالمعاش',
    q24_maleBrothersCount: '1',
    q25_maleSistersCount: '2',
    q26_maleSiblingsEdu: 'مؤهلات عليا',
    q27_maleBirthGov: 'الدقهلية',
    q28_maleCurrentResidence: 'المنصورة - حي الجامعة',
    q29_maleDistrictName: 'حي الجامعة',
    q30_maleDistrictType: 'راقي',
    q31_maleMaritalHome: 'شقة تمليك بالمنصورة جاهزة بالكامل',
    q32_maleHousingSystem: 'تمليك منفصل',
    q33_maleReligiosity: 'متدين',
    q34_malePrayer: 'كل الصلوات في المسجد',
    q35_maleSmoking: 'لا',
    q36_maleQuran: '12 جزء',
    q37_maleMovies: 'لا',
    q38_maleSongs: 'لا',
    q39_malePreachers: 'الشيخ الحويني، الشيخ محمد حسان، د. حازم شومان',
    q40_maleIslamicStudy: 'درست بمعهد إعداد الدعاة',
    q41_maleAboutSelf: 'رجل جاد، مسؤول، كريم، أبحث عن الاستقرار الأسري وبناء بيت مسلم هادئ.',
    q42_maleBasicNotes: 'الشقة جاهزة تماماً ولا ينقصها شيء',
    q47_maleDivorceCert: 'قسيمة_طلاق_1003.jpg',
    q48_maleMarriagesCount: 'مرة واحدة',
    q49_maleHasKidsCount: 'طفل واحد',
    q50_maleKidsAgesCustody: '4 سنوات - في حضانة والدته',
    q51_maleDivorcedNotes: 'الانفصال تم بهدوء وتراضٍ تام',
    q63_malePartnerSpecs: 'ملتزمة، منتقبة أو مستعدة للنقاب، حنونة وتقدر الحياة الزوجية',
    q64_malePartnerAge: 'من 24 إلى 33 سنة',
    q65_malePartnerSkin: 'بيضاء أو قمحية',
    q66_malePartnerStatus: ['آنسة', 'مطلقة', 'أرملة'],
    q67_maleAcceptDivorcedDadCustody: 'نعم',
    q68_maleAcceptWithKids: 'نعم',
    q69_maleAcceptOtherGov: 'الدقهلية أو الغربية أو دمياط',
    q70_malePartnerHijabPref: 'نقاب',
    q71_malePartnerEduPref: 'كلاهما',
    q72_malePartnerWorkPref: 'لا تعمل',
    q73_maleQaymaPref: 'بدون قائمة منقولات (العريس يجهز شقته بالكامل)',
    q74_malePartnerNotes: 'أتحمل تجهيز الشقة بالكامل ولا نكلف أهل العروسة شيئاً',
    q57_maleSender: 'أحد الاقارب',
    q58_maleRelativeType: 'أخ العريس',
    q59_maleWithGroomKnowledge: 'نعم',
    q60_maleRelativeIdFront: 'بطاقة_أخ_العريس_أمامية.jpg',
    q61_maleRelativeIdBack: 'بطاقة_أخ_العريس_خلفية.jpg',
    q62_maleRelativeNotes: 'أنا أخوه الأكبر وأتابعه بنفسي',
    q141_maleIdFront: 'بطاقة_عريس_أمامية_1003.jpg',
    q142_maleIdBack: 'بطاقة_عريس_خلفية_1003.jpg',
    q143_maleSecretPhone: '01288776655',
    q144_maleSecretFb: 'https://facebook.com/mahmoud.fin.1003',
    q145_malePersonalPhoto: 'صورة_شخصية_1003.jpg',
    q146_malePublishFb: 'نعم',
    q147_malePublishTelegram: 'نعم',
    q148_malePrevContact: 'لا',
    q149_maleFinalNotes: '',
    q150_malePledge: true
  },
  {
    id: 'TRK-839204',
    trackingCode: 'TRK-839204',
    approvedCode: '',
    createdAt: '2026-10-26',
    status: 'قيد المراجعة',
    adminNotes: 'استمارة جديدة بانتظار المراجعة والاعتماد من الإدارة.',
    q1_gender: 'عروسة (أنثى)',
    q75_femaleEduLevel: 'مؤهل جامعي (عالي)',
    q76_femaleDegreeType: 'بكالوريوس / ليسانس',
    q77_femaleUniversity: 'جامعة الإسكندرية',
    q78_femaleFaculty: 'كلية التربية',
    q79_femaleMaritalStatus: 'مطلقة',
    q80_femaleBirthDate: '1994-03-21',
    q81_femaleWeight: '65',
    q82_femaleHeight: '162',
    q83_femaleSkinColor: 'قمحي',
    q84_femaleHygiene: 'أحرص عليها دائمًا',
    q85_femaleBeauty: 'جيد جدًا',
    q86_femaleDiseases: 'لا يوجد',
    q87_femaleBirthGov: 'الإسكندرية',
    q88_femaleCurrentResidence: 'الإسكندرية - سموحة',
    q89_femaleDistrictName: 'سموحة',
    q90_femaleDistrictType: 'راقي',
    q91_femaleActualJob: 'معلمة لغة عربية',
    q92_femaleJobType: 'خاص',
    q93_femalePrevEngaged: 'زواج سابق دام عاماً واحداً',
    q94_femaleAcceptMarriedMan: 'على حسب ظروفه',
    q95_femaleKidsGoal: 'نعم',
    q96_femaleReligiosity: 'متدينة',
    q97_femalePrayer: 'أصلي جميع الفروض في وقتها',
    q98_femaleQuran: '8 أجزاء',
    q99_femaleMovies: 'أحيانًا',
    q100_femaleSongs: 'لا',
    q101_femalePreachers: 'الشيخ الشعراوي، د. عمر عبد الكافي',
    q102_femaleIslamicStudy: 'لدي النية لدراسة الفقه والتفسير',
    q103_femaleHijabType: 'نقاب أسود',
    q104_femaleNiqabReady: 'منتقبة بالفعل',
    q105_femaleAboutSelf: 'هادئة، متفهمة، أحب القراءة والتربية الإيجابية، أقدّر الحياة الزوجية.',
    q106_femaleGeneralNotes: '',
    q107_femalePartnerSpecs: 'رجل متدين، صادق، يتحمل المسؤولية ويكرم زوجته',
    q108_femalePartnerAge: 'من 32 إلى 42 سنة',
    q109_femalePartnerEdu: 'عالي',
    q110_femalePartnerSkin: 'أي لون بشرة',
    q111_femalePartnerStatus: ['أعزب', 'مطلق', 'أرمل', 'متزوج'],
    q112_femaleAcceptNoKids: 'نعم',
    q113_femaleAcceptHisCustody: 'نعم',
    q114_femaleAcceptMomCustody: 'نعم',
    q115_femaleAcceptOtherGov: 'الإسكندرية أو البحيرة أو القاهرة',
    q116_femaleSpecialConditions: 'غير مدخن ومحافظ على الصلاة',
    q117_femaleQaymaPref: 'لا مانع (موافقون على أي منهما)',
    q118_femaleQaymaNotes: 'التيسير هو الأساس',
    q125_femaleYearsSinceDivorce: 'عامان',
    q126_femaleDivorceCert: 'قسيمة_طلاق_1004.jpg',
    q127_femaleMarriagesCount: 'مرة واحدة',
    q128_femaleHasKidsCount: 'لا يوجد أولاد',
    q129_femaleKidsAgesCustody: 'لا يوجد',
    q130_femaleKidsFinancialSupport: 'لا يوجد',
    q131_femaleEddaCompleted: 'نعم',
    q132_femaleDivorcedNotes: 'طلاق بدون أولاد',
    q119_femaleSender: 'أحد الأقارب',
    q120_femaleRelativeType: 'والد العروسة',
    q121_femaleWithBrideKnowledge: 'نعم',
    q122_femaleRelativeIdFront: 'بطاقة_والد_العروسة_أمامية.jpg',
    q123_femaleRelativeIdBack: 'بطاقة_والد_العروسة_خلفية.jpg',
    q124_femaleRelativeNotes: 'أنا والدها وأرحب بالتواصل المباشر مع الجادين',
    q151_femaleSecretPhone: '01555667788',
    q152_femaleGuardianSecretPhone: '01223344556',
    q153_femaleSecretFb: 'https://facebook.com/father.alex.1004',
    q154_femaleIdFront: 'بطاقة_عروسة_أمامية_1004.jpg',
    q155_femaleIdBack: 'بطاقة_عروسة_خلفية_1004.jpg',
    q156_femalePersonalPhoto: '',
    q157_femalePublishFb: 'نعم',
    q158_femalePublishTelegram: 'نعم',
    q159_femalePrevContact: 'لا',
    q160_femaleFinalNotes: '',
    q161_femalePledge: true
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'MSG-101',
    senderName: 'أحمد محمود',
    contactInfo: '01098765432',
    trackingCode: 'TRK-839204',
    subject: 'استفسار عن تأكيد الاستمارة',
    message: 'السلام عليكم، قمت بتسجيل استمارة أمس وأود التأكد من استلام المرفقات واعتماد الاستمارة، جزاكم الله خيراً.',
    createdAt: '2026-10-26 14:30',
    isRead: false
  }
];

// ============================================================================
// المكون الرئيسي للتطبيق
// ============================================================================

export default function App() {
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_SUBMISSIONS;
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return INITIAL_MESSAGES;
  });

  // تتبع آخر يوم أرسل فيه المستخدم العادي استمارة أو رسالة (لمنعه من الإرسال أكثر من مرة في اليوم)
  const [lastFormSubmitDate, setLastFormSubmitDate] = useState(() => {
    try {
      return localStorage.getItem(LAST_SUBMIT_DATE_KEY) || '';
    } catch (e) {
      return '';
    }
  });

  const [lastMsgSubmitDate, setLastMsgSubmitDate] = useState(() => {
    try {
      return localStorage.getItem(LAST_MSG_DATE_KEY) || '';
    } catch (e) {
      return '';
    }
  });

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'register' | 'contact' | 'admin'
  const [adminSubTab, setAdminSubTab] = useState('pending'); // 'pending' | 'approved' | 'messages'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminUnlockModal, setShowAdminUnlockModal] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  // نافذة إظهار كود المتابعة للمستخدم فور تسجيل استمارته
  const [submittedTrackingModal, setSubmittedTrackingModal] = useState(null);
  // فحص حالة استمارة بكود المتابعة
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch (e) {}
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
        setShowAdminUnlockModal(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'ش')) {
        e.preventDefault();
        setShowAdminUnlockModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSecretLogoClick = () => {
    const nextCount = logoClickCount + 1;
    if (nextCount >= 5) {
      setLogoClickCount(0);
      if (isAdminAuthenticated) {
        setActiveTab('admin');
      } else {
        setShowAdminUnlockModal(true);
      }
    } else {
      setLogoClickCount(nextCount);
      setTimeout(() => setLogoClickCount(0), 2500);
    }
  };

  // ==========================================================================
  // حالات البحث والفلترة العادية (للزوار)
  // ==========================================================================
  const [publicSearch, setPublicSearch] = useState('');
  const [publicGender, setPublicGender] = useState('الكل');
  const [publicMaritalStatus, setPublicMaritalStatus] = useState('الكل');
  const [publicGov, setPublicGov] = useState('الكل');
  const [publicEduLevel, setPublicEduLevel] = useState('الكل');

  // ==========================================================================
  // حالات البحث والفلترة المتقدمة (للإدارة فقط)
  // ==========================================================================
  const [adminSearch, setAdminSearch] = useState('');
  const [adminGenderFilter, setAdminGenderFilter] = useState('الكل');
  const [adminMaritalFilter, setAdminMaritalFilter] = useState('الكل');
  const [adminGovFilter, setAdminGovFilter] = useState('الكل');
  const [adminEduFilter, setAdminEduFilter] = useState('الكل');
  const [adminFacultyFilter, setAdminFacultyFilter] = useState('الكل');
  const [adminReligiosityFilter, setAdminReligiosityFilter] = useState('الكل');
  const [adminBeardOrHijabFilter, setAdminBeardOrHijabFilter] = useState('الكل');
  const [adminQaymaFilter, setAdminQaymaFilter] = useState('الكل');
  const [adminSenderFilter, setAdminSenderFilter] = useState('الكل');
  const [adminSmokingFilter, setAdminSmokingFilter] = useState('الكل');
  const [adminPublishFbFilter, setAdminPublishFbFilter] = useState('الكل');
  const [adminMinAge, setAdminMinAge] = useState('');
  const [adminMaxAge, setAdminMaxAge] = useState('');

  // الاستمارات المعتمدة فقط هي التي تظهر للزوار في الصفحة الرئيسية
  const approvedSubmissionsOnly = useMemo(
    () => submissions.filter((s) => s.status === 'معتمد'),
    [submissions]
  );

  const pendingSubmissionsCount = useMemo(
    () => submissions.filter((s) => s.status === 'قيد المراجعة').length,
    [submissions]
  );

  // فلترة الزوار (تعمل فقط على الاستمارات التي اعتمدتها الإدارة status === 'معتمد')
  const publicFilteredList = useMemo(() => {
    return approvedSubmissionsOnly.filter((item) => {
      const isMale = item.q1_gender === 'عريس (ذكر)';
      const status = isMale ? item.q6_maleMaritalStatus : item.q79_femaleMaritalStatus;
      const gov = isMale ? item.q27_maleBirthGov : item.q87_femaleBirthGov;
      const edu = isMale ? item.q2_maleEduLevel : item.q75_femaleEduLevel;
      const faculty = isMale ? item.q5_maleFaculty : item.q78_femaleFaculty;
      const job = isMale ? item.q16_maleActualJob : item.q91_femaleActualJob;
      const residence = isMale ? item.q28_maleCurrentResidence : item.q88_femaleCurrentResidence;

      if (publicGender !== 'الكل' && item.q1_gender !== publicGender) return false;
      if (publicMaritalStatus !== 'الكل' && status !== publicMaritalStatus) return false;
      if (publicGov !== 'الكل' && gov !== publicGov) return false;
      if (publicEduLevel !== 'الكل' && edu !== publicEduLevel) return false;

      if (publicSearch.trim() !== '') {
        if (publicSearch.trim() === '#admin1234') return true;
        const q = publicSearch.trim().toLowerCase();
        const searchableText = [
          item.approvedCode,
          item.id,
          status,
          gov,
          edu,
          faculty,
          job,
          residence
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchableText.includes(q)) return false;
      }

      return true;
    });
  }, [approvedSubmissionsOnly, publicSearch, publicGender, publicMaritalStatus, publicGov, publicEduLevel]);

  const handlePublicSearchChange = (val) => {
    if (val.trim() === '#admin1234') {
      setPublicSearch('');
      setIsAdminAuthenticated(true);
      setActiveTab('admin');
      showToast('تم تفعيل وضع الإدارة السري بنجاح!');
      return;
    }
    setPublicSearch(val);
  };

  // البحث بكود المتابعة للمستخدم ليتأكد هل اعتمدت استمارته أم لا
  const handleCheckTrackingCode = (e) => {
    e.preventDefault();
    const code = trackingQuery.trim().toUpperCase();
    if (!code) return;
    const found = submissions.find(
      (s) =>
        (s.trackingCode && s.trackingCode.toUpperCase() === code) ||
        (s.approvedCode && s.approvedCode.toUpperCase() === code) ||
        (s.id && s.id.toUpperCase() === code)
    );
    if (found) {
      setTrackingResult({
        found: true,
        status: found.status,
        trackingCode: found.trackingCode,
        approvedCode: found.approvedCode,
        createdAt: found.createdAt,
        gender: found.q1_gender
      });
    } else {
      setTrackingResult({ found: false, query: code });
    }
  };

  // فلترة الإدارة المتقدمة حسب التبويب المختار (قيد المراجعة أو المعتمدة)
  const adminFilteredList = useMemo(() => {
    return submissions.filter((item) => {
      // فصل تام بين خانة الاستمارات قيد المراجعة وخانة الاستمارات المعتمدة
      if (adminSubTab === 'pending' && item.status !== 'قيد المراجعة') return false;
      if (adminSubTab === 'approved' && item.status !== 'معتمد') return false;

      const isMale = item.q1_gender === 'عريس (ذكر)';
      const status = isMale ? item.q6_maleMaritalStatus : item.q79_femaleMaritalStatus;
      const gov = isMale ? item.q27_maleBirthGov : item.q87_femaleBirthGov;
      const edu = isMale ? item.q2_maleEduLevel : item.q75_femaleEduLevel;
      const faculty = isMale ? item.q5_maleFaculty : item.q78_femaleFaculty;
      const religiosity = isMale ? item.q33_maleReligiosity : item.q96_femaleReligiosity;
      const beardOrHijab = isMale ? item.q12_maleBeard : item.q103_femaleHijabType;
      const qayma = isMale ? item.q73_maleQaymaPref : item.q117_femaleQaymaPref;
      const sender = isMale ? item.q57_maleSender : item.q119_femaleSender;
      const smoking = isMale ? item.q35_maleSmoking : 'لا';
      const pubFb = isMale ? item.q146_malePublishFb : item.q157_femalePublishFb;
      const birthDate = isMale ? item.q7_maleBirthDate : item.q80_femaleBirthDate;
      const age = calculateAgeFromDate(birthDate);

      if (adminGenderFilter !== 'الكل' && item.q1_gender !== adminGenderFilter) return false;
      if (adminMaritalFilter !== 'الكل' && status !== adminMaritalFilter) return false;
      if (adminGovFilter !== 'الكل' && gov !== adminGovFilter) return false;
      if (adminEduFilter !== 'الكل' && edu !== adminEduFilter) return false;
      if (adminFacultyFilter !== 'الكل' && faculty !== adminFacultyFilter) return false;
      if (adminReligiosityFilter !== 'الكل' && religiosity !== adminReligiosityFilter) return false;
      if (adminBeardOrHijabFilter !== 'الكل' && beardOrHijab !== adminBeardOrHijabFilter) return false;
      if (adminQaymaFilter !== 'الكل' && qayma !== adminQaymaFilter) return false;
      if (adminSenderFilter !== 'الكل' && sender !== adminSenderFilter) return false;
      if (adminSmokingFilter !== 'الكل' && smoking !== adminSmokingFilter) return false;
      if (adminPublishFbFilter !== 'الكل' && pubFb !== adminPublishFbFilter) return false;

      if (adminMinAge !== '' && age !== null && age < parseInt(adminMinAge, 10)) return false;
      if (adminMaxAge !== '' && age !== null && age > parseInt(adminMaxAge, 10)) return false;

      if (adminSearch.trim() !== '') {
        const q = adminSearch.trim().toLowerCase();
        const allValues = Object.values(item)
          .map((v) => (Array.isArray(v) ? v.join(' ') : String(v || '')))
          .join(' ')
          .toLowerCase();
        if (!allValues.includes(q)) return false;
      }

      return true;
    });
  }, [
    submissions,
    adminSubTab,
    adminSearch,
    adminGenderFilter,
    adminMaritalFilter,
    adminGovFilter,
    adminEduFilter,
    adminFacultyFilter,
    adminReligiosityFilter,
    adminBeardOrHijabFilter,
    adminQaymaFilter,
    adminSenderFilter,
    adminSmokingFilter,
    adminPublishFbFilter,
    adminMinAge,
    adminMaxAge
  ]);

  const resetAdminFilters = () => {
    setAdminSearch('');
    setAdminGenderFilter('الكل');
    setAdminMaritalFilter('الكل');
    setAdminGovFilter('الكل');
    setAdminEduFilter('الكل');
    setAdminFacultyFilter('الكل');
    setAdminReligiosityFilter('الكل');
    setAdminBeardOrHijabFilter('الكل');
    setAdminQaymaFilter('الكل');
    setAdminSenderFilter('الكل');
    setAdminSmokingFilter('الكل');
    setAdminPublishFbFilter('الكل');
    setAdminMinAge('');
    setAdminMaxAge('');
  };

  const resetPublicFilters = () => {
    setPublicSearch('');
    setPublicGender('الكل');
    setPublicMaritalStatus('الكل');
    setPublicGov('الكل');
    setPublicEduLevel('الكل');
  };

  // اعتماد الاستمارة وتوليد كود الاستمارة الرسمي (برمز المحافظة + النوع + الحالة + سنة الميلاد + الرقم التسلسلي)
  const handleApproveSubmission = (targetItem) => {
    const approvedCount = submissions.filter((s) => s.status === 'معتمد').length;
    const seqNum = 101 + approvedCount;
    const newApprovedCode =
      targetItem.approvedCode || generateApprovedCode(targetItem, seqNum);

    setSubmissions((prev) =>
      prev.map((item) =>
        item.trackingCode === targetItem.trackingCode && item.id === targetItem.id
          ? {
              ...item,
              status: 'معتمد',
              approvedCode: newApprovedCode,
              id: newApprovedCode
            }
          : item
      )
    );

    if (
      selectedApplication &&
      selectedApplication.item.trackingCode === targetItem.trackingCode
    ) {
      setSelectedApplication((prev) => ({
        ...prev,
        item: {
          ...prev.item,
          status: 'معتمد',
          approvedCode: newApprovedCode,
          id: newApprovedCode
        }
      }));
    }

    setNewlyAddedId(newApprovedCode);
    showToast(
      `تم اعتماد الاستمارة بنجاح! الكود الرسمي الجديد: (${newApprovedCode}) وانتقلت إلى الاستمارات المعتمدة.`
    );
  };

  const handleReturnToPending = (targetItem) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === targetItem.id ? { ...item, status: 'قيد المراجعة' } : item
      )
    );
    if (selectedApplication && selectedApplication.item.id === targetItem.id) {
      setSelectedApplication((prev) => ({
        ...prev,
        item: { ...prev.item, status: 'قيد المراجعة' }
      }));
    }
    showToast('تمت إعادة الاستمارة إلى قائمة قيد المراجعة.');
  };

  const handleDeleteSubmission = (id) => {
    setSubmissions((prev) => prev.filter((item) => item.id !== id));
    if (selectedApplication && selectedApplication.item.id === id) {
      setSelectedApplication(null);
    }
    showToast(`تم حذف الاستمارة ${id}`);
  };

  // توليد نص منشور الفيسبوك / التليجرام (بدون البيانات السرية إطلاقاً)
  const generateSocialPostText = (item) => {
    const isMale = item.q1_gender === 'عريس (ذكر)';
    const displayCode = item.approvedCode || item.id;
    if (isMale) {
      return `💍 استمارة زواج معتمدة كود (${displayCode}) - ميثاق ود
• النوع: عريس (ذكر)
• الحالة الاجتماعية: ${item.q6_maleMaritalStatus || '-'}
• المستوى التعليمي: ${item.q2_maleEduLevel || '-'}${item.q5_maleFaculty ? ` (${item.q5_maleFaculty} - ${item.q4_maleUniversity})` : ''}
• تاريخ الميلاد: ${item.q7_maleBirthDate || '-'} | الطول: ${item.q9_maleHeight || '-'} سم | الوزن: ${item.q8_maleWeight || '-'} كجم
• لون البشرة: ${item.q10_maleSkinColor || '-'} | اللحية: ${item.q12_maleBeard || '-'}
• العمل الفعلي: ${item.q16_maleActualJob || '-'} (${Array.isArray(item.q17_maleJobType) ? item.q17_maleJobType.join('، ') : item.q17_maleJobType || '-'}) | الدخل: ${item.q19_maleIncome || '-'}
• محافظة الميلاد: ${item.q27_maleBirthGov || '-'} | الإقامة الحالية: ${item.q28_maleCurrentResidence || '-'}
• سكن الزوجية: ${item.q31_maleMaritalHome || '-'} (${item.q32_maleHousingSystem || '-'})
• الصلاة: ${item.q34_malePrayer || '-'} | التدخين: ${item.q35_maleSmoking || '-'} | حفظ القرآن: ${item.q36_maleQuran || '-'}
• نبذة: ${item.q41_maleAboutSelf || '-'}
• المواصفات المطلوبة في شريكة الحياة: ${item.q63_malePartnerSpecs || '-'} (السن المناسب: ${item.q64_malePartnerAge || '-'} | نظام القائمة: ${item.q73_maleQaymaPref || '-'})
📩 للتواصل والاستفسار يرجى مراسلة الإدارة بكود الاستمارة (${displayCode}).`;
    } else {
      return `🌸 استمارة زواج معتمدة كود (${displayCode}) - ميثاق ود
• النوع: عروسة (أنثى)
• الحالة الاجتماعية: ${item.q79_femaleMaritalStatus || '-'}
• المستوى التعليمي: ${item.q75_femaleEduLevel || '-'}${item.q78_femaleFaculty ? ` (${item.q78_femaleFaculty} - ${item.q77_femaleUniversity})` : ''}
• تاريخ الميلاد: ${item.q80_femaleBirthDate || '-'} | الطول: ${item.q82_femaleHeight || '-'} سم | الوزن: ${item.q81_femaleWeight || '-'} كجم
• لون البشرة: ${item.q83_femaleSkinColor || '-'} | الحجاب: ${item.q103_femaleHijabType || '-'}
• العمل: ${item.q91_femaleActualJob || '-'} (${item.q92_femaleJobType || '-'})
• محافظة الميلاد: ${item.q87_femaleBirthGov || '-'} | الإقامة الحالية: ${item.q88_femaleCurrentResidence || '-'}
• الصلاة: ${item.q97_femalePrayer || '-'} | حفظ القرآن: ${item.q98_femaleQuran || '-'}
• نبذة: ${item.q105_femaleAboutSelf || '-'}
• المواصفات المطلوبة في شريك الحياة: ${item.q107_femalePartnerSpecs || '-'} (السن المناسب: ${item.q108_femalePartnerAge || '-'} | نظام القائمة: ${item.q117_femaleQaymaPref || '-'})
📩 للتواصل والاستفسار يرجى مراسلة الإدارة بكود الاستمارة (${displayCode}).`;
    }
  };

  const copyTextToClipboard = (text, labelMsg) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(labelMsg || 'تم النسخ بنجاح!');
    } catch (e) {
      showToast('تعذر النسخ التلقائي');
    }
  };

  const copySocialPost = (item) => {
    const text = generateSocialPostText(item);
    setCopiedId(item.id);
    copyTextToClipboard(
      text,
      `تم نسخ نص نشر الاستمارة (${item.approvedCode || item.id}) بدون البيانات السرية!`
    );
    setTimeout(() => setCopiedId(null), 2500);
  };

  const todayDateStr = new Date().toISOString().split('T')[0];
  const hasUserSubmittedFormToday =
    !isAdminAuthenticated && lastFormSubmitDate === todayDateStr;
  const hasUserSentMessageToday =
    !isAdminAuthenticated && lastMsgSubmitDate === todayDateStr;

  const unreadMessagesCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages]
  );

  return (
    <div dir="rtl" className="min-h-screen bg-stone-50 text-stone-800 font-sans flex flex-col justify-between">
      <div>
        {/* إشعار عائم (Toast) */}
        {toastMessage && (
          <div className="fixed bottom-5 left-5 z-50 bg-emerald-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-700 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-sm font-bold">{toastMessage}</span>
          </div>
        )}

        {/* الهيدر الرئيسي (لا يظهر فيه زر الإدارة إطلاقاً إلا بعد تسجيل دخول الإدارة فعلياً) */}
        <header className="bg-gradient-to-l from-emerald-950 via-emerald-900 to-teal-900 text-white shadow-lg sticky top-0 z-40 border-b border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div
              onClick={handleSecretLogoClick}
              title="ميثاق ود"
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-emerald-950 fill-emerald-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                    ميثاق ود
                  </h1>
                  <span className="text-[11px] bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-semibold">
                    منصة الزواج الشرعي
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  نظام تسجيل وتنظيم وبحث استمارات الزواج وفق الضوابط الشرعية والخصوصية التامة
                </p>
              </div>
            </div>

            {/* أزرار التنقل للزوار */}
            <nav className="flex flex-wrap items-center gap-1.5 bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-800/80">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'browse'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-800/50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>تصفح الاستمارات المعتمدة ({approvedSubmissionsOnly.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'register'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-800/50'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>تسجيل استمارة جديدة</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'contact'
                    ? 'bg-amber-400 text-emerald-950 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-800/50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>إرسال ملاحظة أو رسالة للإدارة</span>
              </button>

              {/* لا يظهر زر لوحة الإدارة في الشريط العلوي إلا إذا قام المدير بفتح القفل السري */}
              {isAdminAuthenticated && (
                <div className="flex items-center gap-1 border-r border-emerald-700/80 pr-2 mr-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'admin'
                        ? 'bg-amber-400 text-emerald-950 shadow-sm'
                        : 'bg-emerald-800/70 text-amber-300 hover:bg-emerald-800'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>لوحة الإدارة</span>
                    {pendingSubmissionsCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px]">
                        {pendingSubmissionsCount}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminAuthenticated(false);
                      if (activeTab === 'admin') setActiveTab('browse');
                      showToast('تم إغلاق وضع الإدارة وإخفاؤه عن الواجهة');
                    }}
                    title="إغلاق وضع الإدارة وإخفاؤه"
                    className="p-2 rounded-xl text-emerald-200 hover:text-red-300 hover:bg-emerald-900/60 transition"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              )}
            </nav>
          </div>
        </header>

        {/* المحتوى الرئيسي حسب التبويب */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16">
          {/* ==================================================================== */}
          {/* 1. قسم تصفح وبحث الزوار العادي (يعرض الاستمارات المعتمدة فقط) */}
          {/* ==================================================================== */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* بانر ترحيبي + أداة الاستعلام عن حالة الاستمارة بكود المتابعة */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-gradient-to-l from-emerald-950 via-emerald-900 to-teal-900 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between gap-4 border border-emerald-800">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full text-xs text-amber-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>استمارات معتمدة وموثقة بخصوصية وأمان تام</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold leading-snug">
                      تصفح استمارات الزواج المعتمدة وابحث عن شريك الحياة المناسب
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                      جميع الاستمارات المعروضة هنا تمت مراجعتها واعتمادها من الإدارة وتظهر بالبيانات العامة فقط، بينما تُحفظ البيانات السرية وصور البطاقات لدى الإدارة.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-xs sm:text-sm transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>سجّل استمارتك الآن</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-3 rounded-2xl flex items-center gap-2 text-xs sm:text-sm transition"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-300" />
                      <span>إرسال ملاحظة أو رسالة للإدارة</span>
                    </button>
                  </div>
                </div>

                {/* صندوق التحقق من حالة الاستمارة بكود المتابعة */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span>الاستعلام عن حالة استمارتك بالكود</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      أدخل كود المتابعة الذي ظهر لك عند التسجيل (مثال: <code className="font-mono text-stone-700">TRK-839204</code>) لمعرفة هل تم تأكيد استمارتك.
                    </p>
                  </div>

                  <form onSubmit={handleCheckTrackingCode} className="space-y-2.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={trackingQuery}
                        onChange={(e) => {
                          setTrackingQuery(e.target.value);
                          setTrackingResult(null);
                        }}
                        placeholder="أدخل كود المتابعة TRK-XXXXXX"
                        className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 transition"
                      >
                        تحقق
                      </button>
                    </div>

                    {trackingResult && (
                      <div
                        className={`p-3 rounded-2xl text-xs border ${
                          !trackingResult.found
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : trackingResult.status === 'معتمد'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        {!trackingResult.found ? (
                          <p className="font-bold">لم يتم العثور على استمارة بهذا الكود ({trackingResult.query}).</p>
                        ) : trackingResult.status === 'معتمد' ? (
                          <div className="space-y-1">
                            <p className="font-extrabold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                              تم اعتماد استمارتك ونشرها بنجاح!
                            </p>
                            <p>
                              كود الاستمارة المعتمد:{' '}
                              <span className="font-mono font-extrabold bg-white px-2 py-0.5 rounded border border-emerald-300">
                                {trackingResult.approvedCode}
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-extrabold flex items-center gap-1">
                              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                              استمارتك ({trackingResult.trackingCode}) قيد المراجعة حالياً لدى الإدارة.
                            </p>
                            <p className="text-[11px]">
                              ستظهر في قائمة الاستمارات فور تأكيدها واعتمادها من الإدارة.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* شريط البحث والفلترة العادية للزوار */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/90 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3.5">
                  <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm sm:text-base">
                    <Search className="w-5 h-5 text-emerald-700" />
                    <span>البحث والفلترة في الاستمارات المعتمدة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(publicSearch || publicGender !== 'الكل' || publicMaritalStatus !== 'الكل' || publicGov !== 'الكل' || publicEduLevel !== 'الكل') && (
                      <button
                        type="button"
                        onClick={resetPublicFilters}
                        className="text-xs text-stone-600 hover:text-emerald-800 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-full font-bold flex items-center gap-1 transition"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>عرض الكل</span>
                      </button>
                    )}
                    <span className="text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-3.5 py-1 rounded-full font-extrabold">
                      الاستمارات المعتمدة المعروضة: {publicFilteredList.length} من {approvedSubmissionsOnly.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  <div className="lg:col-span-1">
                    <label className="block text-xs font-bold text-stone-600 mb-1.5">
                      بحث بالكود المعتمد أو المهنة أو الكلية
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                      <input
                        type="text"
                        value={publicSearch}
                        onChange={(e) => handlePublicSearchChange(e.target.value)}
                        placeholder="مثال: GIZ-M195-101، مهندس..."
                        className="w-full pr-9 pl-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1.5">
                      النوع (عريس / عروسة)
                    </label>
                    <select
                      value={publicGender}
                      onChange={(e) => setPublicGender(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="الكل">الكل (عرسان وعرائس)</option>
                      <option value="عريس (ذكر)">عريس (ذكر)</option>
                      <option value="عروسة (أنثى)">عروسة (أنثى)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1.5">
                      الحالة الاجتماعية
                    </label>
                    <select
                      value={publicMaritalStatus}
                      onChange={(e) => setPublicMaritalStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="الكل">الكل</option>
                      <option value="أعزب">أعزب</option>
                      <option value="متزوج">متزوج</option>
                      <option value="منفصل بدون طلاق">منفصل بدون طلاق</option>
                      <option value="مطلق">مطلق</option>
                      <option value="أرمل">أرمل</option>
                      <option value="عزباء (بكر)">عزباء (بكر)</option>
                      <option value="مطلقة">مطلقة</option>
                      <option value="أرملة">أرملة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1.5">
                      محافظة الميلاد
                    </label>
                    <select
                      value={publicGov}
                      onChange={(e) => setPublicGov(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="الكل">كل المحافظات</option>
                      {GOVERNORATES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1.5">
                      المستوى التعليمي
                    </label>
                    <select
                      value={publicEduLevel}
                      onChange={(e) => setPublicEduLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="الكل">الكل</option>
                      <option value="مؤهل جامعي (عالي)">مؤهل جامعي (عالي)</option>
                      <option value="معهد">معهد</option>
                      <option value="مؤهل متوسط (دبلوم)">مؤهل متوسط (دبلوم)</option>
                      <option value="ثانوي عام">ثانوي عام</option>
                      <option value="ثانوية عامة">ثانوية عامة</option>
                      <option value="ثانوي أزهر">ثانوي أزهر</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* بطاقات عرض الاستمارات المعتمدة للزوار */}
              {publicFilteredList.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm">
                  <Search className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-stone-700">لا توجد استمارات معتمدة مطابقة لبحثك</h3>
                  <p className="text-xs text-stone-500 mt-1 mb-4">جرّب تغيير خيارات البحث أو الفلترة لعرض جميع الاستمارات المعتمدة.</p>
                  <button
                    type="button"
                    onClick={resetPublicFilters}
                    className="px-5 py-2.5 rounded-xl bg-emerald-900 text-white text-xs font-bold"
                  >
                    إعادة عرض جميع الاستمارات المعتمدة ({approvedSubmissionsOnly.length})
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publicFilteredList.map((item) => (
                    <ApplicationCard
                      key={item.id}
                      item={item}
                      isNewlyAdded={item.id === newlyAddedId}
                      isAdminView={false}
                      onSelect={() => setSelectedApplication({ item, isAdmin: false })}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================================== */}
          {/* 2. قسم تسجيل استمارة جديدة (تذهب لقسم قيد المراجعة + قيد يومي للزوار) */}
          {/* ==================================================================== */}
          {activeTab === 'register' && (
            <div>
              {hasUserSubmittedFormToday ? (
                <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 text-center shadow-sm border border-amber-200 space-y-4 mt-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-800">
                    لقد قمت بإرسال استمارة اليوم بالفعل
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    حرصاً على تنظيم المراجعة ومنع تكرار الطلبات، يُسمح لكل مستخدم بإرسال <strong>استمارة واحدة فقط في اليوم</strong>. استمارتك المرسلة اليوم موجودة حالياً لدى الإدارة في قائمة <strong>قيد المراجعة</strong>.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('browse')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-900 text-white text-xs sm:text-sm font-bold"
                    >
                      العودة لتصفح الاستمارات والاستعلام بالكود
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('contact')}
                      className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-bold"
                    >
                      إرسال ملاحظة للإدارة
                    </button>
                  </div>
                </div>
              ) : (
                <RegistrationWizard
                  isAdmin={isAdminAuthenticated}
                  onSubmitApplication={(newApp) => {
                    const trackingCode = generateTrackingCode();
                    const today = new Date().toISOString().split('T')[0];
                    const record = {
                      ...newApp,
                      id: trackingCode,
                      trackingCode,
                      approvedCode: '',
                      createdAt: today,
                      status: 'قيد المراجعة',
                      adminNotes: 'استمارة جديدة بانتظار المراجعة والاعتماد'
                    };
                    setSubmissions((prev) => [record, ...prev]);

                    // إذا لم يكن أدمن، نسجل تاريخ اليوم لمنعه من إرسال أكثر من استمارة في نفس اليوم
                    if (!isAdminAuthenticated) {
                      setLastFormSubmitDate(today);
                      try {
                        localStorage.setItem(LAST_SUBMIT_DATE_KEY, today);
                      } catch (e) {}
                    }

                    setSubmittedTrackingModal({
                      trackingCode,
                      gender: newApp.q1_gender,
                      createdAt: today
                    });
                    setActiveTab('browse');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          )}

          {/* ==================================================================== */}
          {/* 3. قسم إرسال ملاحظة أو رسالة للإدارة (مرة واحدة في اليوم للمستخدم) */}
          {/* ==================================================================== */}
          {activeTab === 'contact' && (
            <UserMessageSection
              hasSentToday={hasUserSentMessageToday}
              isAdmin={isAdminAuthenticated}
              onSendMessage={(msgObj) => {
                const newMsg = {
                  ...msgObj,
                  id: `MSG-${101 + messages.length}`,
                  createdAt: new Date().toLocaleString('ar-EG'),
                  isRead: false
                };
                setMessages((prev) => [newMsg, ...prev]);
                if (!isAdminAuthenticated) {
                  setLastMsgSubmitDate(todayDateStr);
                  try {
                    localStorage.setItem(LAST_MSG_DATE_KEY, todayDateStr);
                  } catch (e) {}
                }
                showToast('تم إرسال رسالتك وملاحظتك للإدارة بنجاح!');
              }}
            />
          )}

          {/* ==================================================================== */}
          {/* 4. قسم لوحة تحكم الإدارة المنظمة (قيد المراجعة | المعتمدة | رسائل الزوار) */}
          {/* ==================================================================== */}
          {activeTab === 'admin' && isAdminAuthenticated && (
            <div className="space-y-6">
              {/* شريط إحصائيات الإدارة */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <span className="text-xs text-stone-500 font-medium">إجمالي الاستمارات</span>
                  <div className="text-2xl font-extrabold text-stone-800 mt-1">
                    {submissions.length}
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm">
                  <span className="text-xs text-amber-900 font-bold">استمارات قيد المراجعة</span>
                  <div className="text-2xl font-extrabold text-amber-700 mt-1">
                    {pendingSubmissionsCount}
                  </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-xs text-emerald-900 font-bold">الاستمارات المعتمدة</span>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                    {approvedSubmissionsOnly.length}
                  </div>
                </div>
                <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 shadow-sm">
                  <span className="text-xs text-sky-900 font-bold">رسائل وملاحظات الزوار</span>
                  <div className="text-2xl font-extrabold text-sky-700 mt-1">
                    {messages.length}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 font-medium">صلاحيات الأدمن</span>
                    <div className="text-xs font-extrabold text-emerald-800 mt-1 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>تسجيل غير محدود</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminAuthenticated(false);
                      setActiveTab('browse');
                      showToast('تم إقفال لوحة الإدارة وإخفاؤها عن الزوار');
                    }}
                    className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-xl font-bold transition"
                  >
                    إخفاء
                  </button>
                </div>
              </div>

              {/* تبويبات تنظيم صفحة الإدارة (خانة قيد المراجعة | خانة المعتمدة | خانة رسائل الزوار) */}
              <div className="bg-white p-2 rounded-3xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminSubTab('pending')}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition ${
                      adminSubTab === 'pending'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>خانة الاستمارات قيد المراجعة</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        adminSubTab === 'pending'
                          ? 'bg-white text-amber-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {pendingSubmissionsCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminSubTab('approved')}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition ${
                      adminSubTab === 'approved'
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <BadgeCheck className="w-4 h-4" />
                    <span>خانة الاستمارات المعتمدة</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        adminSubTab === 'approved'
                          ? 'bg-amber-400 text-emerald-950'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {approvedSubmissionsOnly.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdminSubTab('messages')}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition ${
                      adminSubTab === 'messages'
                        ? 'bg-sky-900 text-white shadow-sm'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Inbox className="w-4 h-4" />
                    <span>صندوق رسائل وملاحظات المستخدمين</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        adminSubTab === 'messages'
                          ? 'bg-white text-sky-900'
                          : 'bg-sky-100 text-sky-900'
                      }`}
                    >
                      {messages.length} {unreadMessagesCount > 0 ? `(${unreadMessagesCount} جديد)` : ''}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إضافة استمارة جديدة (صلاحية أدمن مفتوحة)</span>
                </button>
              </div>

              {adminSubTab === 'messages' ? (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-extrabold text-stone-800 text-base flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-sky-700" />
                      <span>رسائل وملاحظات الزوار الواردة للإدارة ({messages.length})</span>
                    </h3>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-sm">
                      لا توجد رسائل واردة حتى الآن.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            m.isRead
                              ? 'bg-stone-50 border-stone-200'
                              : 'bg-sky-50/60 border-sky-300'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold bg-white px-2.5 py-0.5 rounded border border-stone-200">
                                {m.id}
                              </span>
                              <span className="font-extrabold text-sm text-stone-800">
                                {m.senderName}
                              </span>
                              <span className="text-xs text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                التواصل: {m.contactInfo}
                              </span>
                              {m.trackingCode && (
                                <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                                  كود الاستمارة: {m.trackingCode}
                                </span>
                              )}
                              <span className="text-xs text-stone-400">{m.createdAt}</span>
                            </div>
                            <div className="text-xs font-bold text-sky-950">
                              الموضوع: {m.subject}
                            </div>
                            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                              {m.message}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {!m.isRead && (
                              <button
                                type="button"
                                onClick={() =>
                                  setMessages((prev) =>
                                    prev.map((x) => (x.id === m.id ? { ...x, isRead: true } : x))
                                  )
                                }
                                className="px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold"
                              >
                                تحديد كمقروء
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setMessages((prev) => prev.filter((x) => x.id !== m.id))
                              }
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                              title="حذف الرسالة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* لوحة البحث والفلترة المتقدمة الخاصة بالإدارة */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-emerald-800/20 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center">
                          <SlidersHorizontal className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-stone-800 text-base">
                            {adminSubTab === 'pending'
                              ? 'فلترة وبحث الاستمارات قيد المراجعة (بانتظار التأكيد)'
                              : 'فلترة وبحث الاستمارات المعتمدة والمنشورة'}
                          </h3>
                          <p className="text-xs text-stone-500">
                            يمكنك البحث بكود المتابعة (TRK-...)، أو الكود المعتمد، أو رقم الهاتف السري، أو الكلية، أو الحالة.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl font-bold">
                          النتائج المعروضة: {adminFilteredList.length}
                        </span>
                        <button
                          type="button"
                          onClick={resetAdminFilters}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>إعادة ضبط الفلاتر</span>
                        </button>
                      </div>
                    </div>

                    {/* الصف الأول من الفلاتر المتقدمة */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          بحث شامل (كود المتابعة TRK، الكود المعتمد، رقم الهاتف السري، الحساب، المنطقة)
                        </label>
                        <div className="relative">
                          <Search className="w-4 h-4 text-emerald-700 absolute right-3 top-2.5" />
                          <input
                            type="text"
                            value={adminSearch}
                            onChange={(e) => setAdminSearch(e.target.value)}
                            placeholder="ابحث بكود المتابعة TRK-839204 أو الهاتف السري أو الكلية..."
                            className="w-full pr-9 pl-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          النوع (عريس / عروسة)
                        </label>
                        <select
                          value={adminGenderFilter}
                          onChange={(e) => setAdminGenderFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">الكل</option>
                          <option value="عريس (ذكر)">عريس (ذكر)</option>
                          <option value="عروسة (أنثى)">عروسة (أنثى)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          الحالة الاجتماعية الدقيقة
                        </label>
                        <select
                          value={adminMaritalFilter}
                          onChange={(e) => setAdminMaritalFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">الكل</option>
                          <option value="أعزب">أعزب</option>
                          <option value="متزوج">متزوج</option>
                          <option value="منفصل بدون طلاق">منفصل بدون طلاق</option>
                          <option value="مطلق">مطلق</option>
                          <option value="أرمل">أرمل</option>
                          <option value="عزباء (بكر)">عزباء (بكر)</option>
                          <option value="مطلقة">مطلقة</option>
                          <option value="أرملة">أرملة</option>
                        </select>
                      </div>
                    </div>

                    {/* الصف الثاني من الفلاتر المتقدمة */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          المحافظة
                        </label>
                        <select
                          value={adminGovFilter}
                          onChange={(e) => setAdminGovFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">كل المحافظات</option>
                          {GOVERNORATES.map((g) => (
                            <option key={g} value={g}>
                              {g} ({GOV_CODES[g]})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          المستوى التعليمي
                        </label>
                        <select
                          value={adminEduFilter}
                          onChange={(e) => setAdminEduFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">الكل</option>
                          <option value="مؤهل جامعي (عالي)">مؤهل جامعي (عالي)</option>
                          <option value="معهد">معهد</option>
                          <option value="مؤهل متوسط (دبلوم)">مؤهل متوسط (دبلوم)</option>
                          <option value="ثانوي عام">ثانوي عام</option>
                          <option value="ثانوية عامة">ثانوية عامة</option>
                          <option value="ثانوي أزهر">ثانوي أزهر</option>
                          <option value="إعدادي">إعدادي / إعدادية</option>
                          <option value="إبتدائي">إبتدائي / إبتدائية</option>
                          <option value="غير متعلم">غير متعلم / غير متعلمة</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          الكلية / التخصص الجامعي
                        </label>
                        <select
                          value={adminFacultyFilter}
                          onChange={(e) => setAdminFacultyFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">كل الكليات</option>
                          {FACULTIES.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          اللحية / نوع الحجاب
                        </label>
                        <select
                          value={adminBeardOrHijabFilter}
                          onChange={(e) => setAdminBeardOrHijabFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">الكل</option>
                          <optgroup label="اللحية (للعريس)">
                            <option value="تارك اللحية سنة">تارك اللحية سنة</option>
                            <option value="لحية خفيفة تأخذ منها">لحية خفيفة تأخذ منها</option>
                            <option value="لحية علي الموضة">لحية علي الموضة</option>
                            <option value="أملس">أملس</option>
                            <option value="حالق اللحية">حالق اللحية</option>
                          </optgroup>
                          <optgroup label="الحجاب (للعروسة)">
                            <option value="نقاب أسود">نقاب أسود</option>
                            <option value="نقاب ألوان">نقاب ألوان</option>
                            <option value="خمار إسلامي">خمار إسلامي</option>
                            <option value="طرح وفساتين">طرح وفساتين</option>
                            <option value="جيب وبناطيل">جيب وبناطيل</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    {/* الصف الثالث من الفلاتر المتقدمة */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          موقف قائمة المنقولات (للإدارة)
                        </label>
                        <select
                          value={adminQaymaFilter}
                          onChange={(e) => setAdminQaymaFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">الكل</option>
                          <option value="بدون قائمة منقولات (العريس يجهز شقته بالكامل)">
                            بدون قائمة (للعريس)
                          </option>
                          <option value="بدون قائمة منقولات (بالمهر والفرش الكامل من العريس)">
                            بدون قائمة (للعروسة)
                          </option>
                          <option value="قائمة منقولات">بقائمة منقولات (للعريس)</option>
                          <option value="قائمة منقولات (مشاركة في الفرش)">
                            بقائمة منقولات (للعروسة)
                          </option>
                          <option value="لا مانع (موافق علي أي منهما)">لا مانع (للعريس)</option>
                          <option value="لا مانع (موافقون على أي منهما)">لا مانع (للعروسة)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          مرسل الاستمارة
                        </label>
                        <select
                          value={adminSenderFilter}
                          onChange={(e) => setAdminSenderFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">الكل</option>
                          <option value="أنت (العريس)">العريس نفسه</option>
                          <option value="أنتِ (العروسة)">العروسة نفسها</option>
                          <option value="أحد الاقارب">أحد الأقارب (عريس)</option>
                          <option value="أحد الأقارب">أحد الأقارب (عروسة)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          الموافقة على النشر بفيسبوك
                        </label>
                        <select
                          value={adminPublishFbFilter}
                          onChange={(e) => setAdminPublishFbFilter(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                        >
                          <option value="الكل">الكل</option>
                          <option value="نعم">موافق على النشر (نعم)</option>
                          <option value="لا">غير موافق (لا)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          العمر من (سنة)
                        </label>
                        <input
                          type="number"
                          value={adminMinAge}
                          onChange={(e) => setAdminMinAge(e.target.value)}
                          placeholder="مثال: 22"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          العمر إلى (سنة)
                        </label>
                        <input
                          type="number"
                          value={adminMaxAge}
                          onChange={(e) => setAdminMaxAge(e.target.value)}
                          placeholder="مثال: 38"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* عرض بطاقات الإدارة حسب التبويب (قيد المراجعة أو المعتمدة) */}
                  {adminFilteredList.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                      <CheckCircle2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                      <h4 className="font-extrabold text-stone-700 text-base">
                        {adminSubTab === 'pending'
                          ? 'لا توجد استمارات قيد المراجعة حالياً'
                          : 'لا توجد استمارات معتمدة مطابقة للفلاتر'}
                      </h4>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {adminFilteredList.map((item) => (
                        <ApplicationCard
                          key={item.id + '_' + item.trackingCode}
                          item={item}
                          isNewlyAdded={item.id === newlyAddedId}
                          isAdminView={true}
                          onSelect={() => setSelectedApplication({ item, isAdmin: true })}
                          onCopyPost={() => copySocialPost(item)}
                          copiedId={copiedId}
                          onApprove={() => handleApproveSubmission(item)}
                          onReturnToPending={() => handleReturnToPending(item)}
                          onDelete={() => handleDeleteSubmission(item.id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* الفوتر السفلي */}
      <footer className="bg-white border-t border-stone-200/80 py-5 px-4 sm:px-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-800 fill-emerald-800" />
            <span className="font-bold text-stone-700">منصة ميثاق ود للزواج الشرعي</span>
            <span>— جميع الحقوق محفوظة © 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-400">جميع البيانات محمية وفق ضوابط الخصوصية</span>
            <button
              type="button"
              onClick={() => {
                if (isAdminAuthenticated) {
                  setActiveTab('admin');
                } else {
                  setShowAdminUnlockModal(true);
                }
              }}
              title="بوابة المشرف"
              className="p-1.5 rounded-lg text-stone-300 hover:text-stone-500 transition"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* نافذة إظهار كود المتابعة للمستخدم فور تسجيل استمارته */}
      {submittedTrackingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            dir="rtl"
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-emerald-700 text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                تم استلام استمارتك وهي الآن قيد المراجعة
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-800">
                احتفظ بكود المتابعة الخاص بك
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                لا تظهر الاستمارة للزوار على الموقع إلا بعد مراجعتها وتأكيدها من إدارة "ميثاق ود". يرجى الاحتفاظ بهذا الكود لإرساله للإدارة أو للاستعلام به عن تأكيد استمارتك:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-100 border-2 border-dashed border-emerald-700 flex items-center justify-between gap-3">
              <div className="text-right">
                <span className="text-[11px] text-stone-500 block font-bold">
                  كود متابعة وتأكيد الاستمارة:
                </span>
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-900 tracking-wider">
                  {submittedTrackingModal.trackingCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  copyTextToClipboard(
                    submittedTrackingModal.trackingCode,
                    `تم نسخ كود المتابعة (${submittedTrackingModal.trackingCode})`
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-4 h-4" />
                <span>نسخ الكود</span>
              </button>
            </div>

            <div className="text-xs text-stone-500 bg-amber-50/80 border border-amber-200 p-3 rounded-xl text-right leading-relaxed">
              💡 <strong>ملاحظة:</strong> بمجرد اعتماد الإدارة لاستمارتك، سيصدر لها <strong>كود رسمي معتمد</strong> يحتوي على رمز محافظتك وبيانات الاستمارة وتنضم فوراً لقائمة الاستمارات المعتمدة.
            </div>

            <button
              type="button"
              onClick={() => setSubmittedTrackingModal(null)}
              className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-sm transition"
            >
              حسناً، احتفظت بالكود
            </button>
          </div>
        </div>
      )}

      {/* نافذة البوابة السرية لدخول الإدارة */}
      {showAdminUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            dir="rtl"
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative"
          >
            <button
              type="button"
              onClick={() => {
                setShowAdminUnlockModal(false);
                setAdminPinError('');
              }}
              className="absolute top-4 left-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-extrabold text-stone-800">
              بوابة المشرف السرية (إدارة ميثاق ود)
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              هذه النافذة مخفية عن الزوار. يمكنك فتحها بالضغط 5 مرات على شعار الموقع، أو باختصار <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded">Ctrl+Shift+A</code>، أو من رمز القفل الصغير أسفل الصفحة.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (adminPinInput.trim() === '1234' || adminPinInput.trim() === 'admin') {
                  setIsAdminAuthenticated(true);
                  setShowAdminUnlockModal(false);
                  setAdminPinInput('');
                  setAdminPinError('');
                  setActiveTab('admin');
                  showToast('تم فتح لوحة الإدارة السرية بنجاح');
                } else {
                  setAdminPinError('الرمز السري غير صحيح (الرمز الافتراضي للتجربة: 1234)');
                }
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  أدخل الرمز السري للإدارة
                </label>
                <input
                  type="password"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  placeholder="الرمز الافتراضي: 1234"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                {adminPinError && (
                  <p className="text-xs text-red-600 mt-1.5 font-bold">{adminPinError}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-sm transition"
                >
                  فتح لوحة الإدارة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminUnlockModal(false);
                    setAdminPinError('');
                  }}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة عرض تفاصيل الاستمارة الكاملة المحسنة */}
      {selectedApplication && (
        <ApplicationDetailsModal
          item={selectedApplication.item}
          isAdmin={selectedApplication.isAdmin && isAdminAuthenticated}
          onClose={() => setSelectedApplication(null)}
          onCopyPost={() => copySocialPost(selectedApplication.item)}
          onApprove={() => handleApproveSubmission(selectedApplication.item)}
          onReturnToPending={() => handleReturnToPending(selectedApplication.item)}
        />
      )}
    </div>
  );
}

// ============================================================================
// مكون قسم "إرسال ملاحظة أو رسالة للإدارة" (مرة واحدة يومياً للمستخدم)
// ============================================================================

function UserMessageSection({ hasSentToday, isAdmin, onSendMessage }) {
  const [senderName, setSenderName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [subject, setSubject] = useState('استفسار عن تأكيد استمارة');
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (hasSentToday && !sentSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 text-center shadow-sm border border-amber-200 space-y-4 mt-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Clock className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-extrabold text-stone-800">
          لقد أرسلت ملاحظة أو رسالة للإدارة اليوم بالفعل
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          لتنظيم الرد على جميع المتقدمين، يُتاح لكل مستخدم إرسال <strong>رسالة أو ملاحظة واحدة فقط في اليوم</strong>. ستقوم الإدارة بمراجعة رسالتك في أقرب وقت.
        </p>
      </div>
    );
  }

  if (sentSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 text-center shadow-sm border border-emerald-200 space-y-4 mt-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-stone-800">
          تم إرسال رسالتك إلى إدارة "ميثاق ود" بنجاح!
        </h3>
        <p className="text-sm text-stone-600 leading-relaxed">
          شكراً لتواصلك معنا. وصلت رسالتك إلى صندوق رسائل الإدارة وسيتم مراجعتها والعمل عليها.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
      <div className="border-b border-stone-100 pb-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center shrink-0">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-800">
            إرسال ملاحظة أو رسالة للإدارة
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            يمكنك إرسال كود متابعة استمارتك لتأكيدها، أو طلب التقدم لكود استمارة معتمدة، أو إرسال أي مقترح (متاح مرة واحدة يومياً).
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!senderName.trim() || !contactInfo.trim() || !message.trim()) {
            setErr('يرجى ملء الاسم، وسيلة التواصل، ونص الرسالة.');
            return;
          }
          onSendMessage({
            senderName: senderName.trim(),
            contactInfo: contactInfo.trim(),
            trackingCode: trackingCode.trim(),
            subject,
            message: message.trim()
          });
          setSentSuccess(true);
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              الاسم أو الكنية <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => {
                setSenderName(e.target.value);
                setErr('');
              }}
              placeholder="مثال: محمد أحمد / أم مريم"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              رقم الهاتف أو رابط الفيسبوك للتواصل (سري للإدارة) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => {
                setContactInfo(e.target.value);
                setErr('');
              }}
              placeholder="مثال: 01012345678"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              نوع الرسالة / الموضوع
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="استفسار عن تأكيد استمارة">استفسار عن تأكيد استمارة مسجلة</option>
              <option value="طلب تواصل بخصوص استمارة معتمدة">طلب تواصل بخصوص استمارة معتمدة</option>
              <option value="تعديل بيانات في استمارتي">طلب تعديل بيانات في استمارتي</option>
              <option value="ملاحظة أو اقتراح عام للإدارة">ملاحظة أو اقتراح عام للإدارة</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              كود المتابعة أو كود الاستمارة (اختياري)
            </label>
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="مثال: TRK-839204 أو GIZ-M195-101"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            نص الملاحظة أو الرسالة للإدارة <span className="text-red-600">*</span>
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setErr('');
            }}
            placeholder="اكتب رسالتك أو ملاحظتك للإدارة بوضوح..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {err && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {err}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition"
        >
          <Send className="w-4 h-4" />
          <span>إرسال الرسالة للإدارة</span>
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// مكون بطاقة الاستمارة الخارجي (تم إخفاء جملة "لا مانع (موافق علي أي منهما)" من الخارج)
// ============================================================================

function ApplicationCard({
  item,
  isNewlyAdded,
  isAdminView,
  onSelect,
  onCopyPost,
  copiedId,
  onApprove,
  onReturnToPending,
  onDelete
}) {
  const isMale = item.q1_gender === 'عريس (ذكر)';
  const status = isMale ? item.q6_maleMaritalStatus : item.q79_femaleMaritalStatus;
  const edu = isMale ? item.q2_maleEduLevel : item.q75_femaleEduLevel;
  const faculty = isMale ? item.q5_maleFaculty : item.q78_femaleFaculty;
  const uni = isMale ? item.q4_maleUniversity : item.q77_femaleUniversity;
  const birthDate = isMale ? item.q7_maleBirthDate : item.q80_femaleBirthDate;
  const age = calculateAgeFromDate(birthDate);
  const height = isMale ? item.q9_maleHeight : item.q82_femaleHeight;
  const weight = isMale ? item.q8_maleWeight : item.q81_femaleWeight;
  const skinColor = isMale ? item.q10_maleSkinColor : item.q83_femaleSkinColor;
  const gov = isMale ? item.q27_maleBirthGov : item.q87_femaleBirthGov;
  const residence = isMale ? item.q28_maleCurrentResidence : item.q88_femaleCurrentResidence;
  const job = isMale ? item.q16_maleActualJob : item.q91_femaleActualJob;
  const beardOrHijab = isMale ? item.q12_maleBeard : item.q103_femaleHijabType;
  const prayer = isMale ? item.q34_malePrayer : item.q97_femalePrayer;
  const quran = isMale ? item.q36_maleQuran : item.q98_femaleQuran;
  const rawQayma = isMale ? item.q73_maleQaymaPref : item.q117_femaleQaymaPref;
  // عدم إظهار جملة "لا مانع (موافق علي أي منهما)" أو "لا مانع (موافقون على أي منهما)" في البطاقة من الخارج
  const showQaymaBadgeOnOutside =
    rawQayma && !rawQayma.includes('لا مانع');

  const aboutSelf = isMale ? item.q41_maleAboutSelf : item.q105_femaleAboutSelf;
  const partnerSpecs = isMale ? item.q63_malePartnerSpecs : item.q107_femalePartnerSpecs;
  const sender = isMale ? item.q57_maleSender : item.q119_femaleSender;

  const secretPhone = isMale ? item.q143_maleSecretPhone : item.q151_femaleSecretPhone;
  const secretGuardianPhone = !isMale ? item.q152_femaleGuardianSecretPhone : null;
  const secretFb = isMale ? item.q144_maleSecretFb : item.q153_femaleSecretFb;
  const idFront = isMale ? item.q141_maleIdFront : item.q154_femaleIdFront;
  const idBack = isMale ? item.q142_maleIdBack : item.q155_femaleIdBack;

  const displayCode = item.approvedCode || item.id;

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl ${
        isNewlyAdded
          ? 'ring-2 ring-amber-400 border-amber-400'
          : isMale
          ? 'border-emerald-200/80 hover:border-emerald-400'
          : 'border-rose-200/80 hover:border-rose-400'
      }`}
    >
      <div>
        {/* الهيدر الفاخر للبطاقة */}
        <div
          className={`px-6 py-4 flex items-center justify-between relative ${
            isMale
              ? 'bg-gradient-to-l from-emerald-950 via-emerald-900 to-teal-800 text-white'
              : 'bg-gradient-to-l from-rose-950 via-rose-900 to-pink-800 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-inner border ${
                isMale
                  ? 'bg-emerald-800/80 border-emerald-600 text-amber-300'
                  : 'bg-rose-800/80 border-rose-600 text-amber-200'
              }`}
            >
              {isMale ? '🤵' : '👰'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">
                  {isMale ? 'استمارة عريس' : 'استمارة عروسة'}
                </span>
                {item.approvedCode ? (
                  <span
                    title="كود الاستمارة المعتمد (يتضمن رمز المحافظة والنوع والحالة وسنة الميلاد)"
                    className="font-mono text-xs font-extrabold bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-lg shadow-sm"
                  >
                    كود معتمد: {item.approvedCode}
                  </span>
                ) : (
                  <span className="font-mono text-xs font-extrabold bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20 text-amber-300">
                    كود المراجعة: {item.trackingCode || item.id}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  {gov || 'غير محدد'} ({GOV_CODES[gov] || 'EGY'})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {item.createdAt}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-white/95 text-stone-900 shadow-sm">
              {status || 'غير محدد'}
            </span>
            {isAdminView && item.trackingCode && item.approvedCode && (
              <span className="font-mono text-[10px] text-amber-200">
                متابعة: {item.trackingCode}
              </span>
            )}
          </div>
        </div>

        {/* شريط الإحصائيات السريعة */}
        <div className="grid grid-cols-4 divide-x divide-x-reverse divide-stone-200/70 bg-stone-50/90 border-b border-stone-200/70 text-center py-2.5 px-2">
          <div>
            <span className="text-[10px] text-stone-400 font-semibold block">السن</span>
            <span className="text-xs sm:text-sm font-extrabold text-stone-800">
              {age ? `${age} سنة` : birthDate || '—'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-semibold block">الطول</span>
            <span className="text-xs sm:text-sm font-extrabold text-stone-800">
              {height ? `${height} سم` : '—'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-semibold block">الوزن</span>
            <span className="text-xs sm:text-sm font-extrabold text-stone-800">
              {weight ? `${weight} كجم` : '—'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-semibold block">البشرة</span>
            <span className="text-xs sm:text-sm font-extrabold text-stone-800">
              {skinColor || '—'}
            </span>
          </div>
        </div>

        {/* جسم البطاقة التفصيلي */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isMale ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-stone-400 font-semibold block">المؤهل الدراسي</span>
                <span className="font-bold text-stone-800 block truncate" title={faculty ? `${faculty} - ${uni}` : edu}>
                  {faculty ? `${faculty}` : edu || 'غير محدد'}
                </span>
                {uni && <span className="text-[11px] text-stone-500 block truncate">{uni}</span>}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isMale ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-stone-400 font-semibold block">العمل والوظيفة</span>
                <span className="font-bold text-stone-800 block truncate" title={job}>
                  {job || 'غير محدد'}
                </span>
                <span className="text-[11px] text-stone-500 block truncate">
                  الإقامة: {residence || gov || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* أوسمة الالتزام والمظهر (بدون إظهار جملة "لا مانع (موافق علي أي منهما)" من الخارج) */}
          <div className="flex flex-wrap gap-1.5">
            {beardOrHijab && (
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                  isMale
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                {isMale ? `اللحية: ${beardOrHijab}` : `الحجاب: ${beardOrHijab}`}
              </span>
            )}
            {prayer && (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                الصلاة: {prayer}
              </span>
            )}
            {quran && (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                القرآن: {quran}
              </span>
            )}
            {showQaymaBadgeOnOutside && (
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 text-sky-900 border border-sky-200">
                {rawQayma}
              </span>
            )}
          </div>

          {/* نبذة مختصرة عن الشخص والمواصفات المطلوبة */}
          <div className="space-y-2 pt-1">
            {aboutSelf && (
              <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70">
                <span className="text-[11px] font-extrabold text-stone-500 block mb-0.5">
                  نبذة عن {isMale ? 'العريس' : 'العروسة'}:
                </span>
                <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">{aboutSelf}</p>
              </div>
            )}

            {partnerSpecs && (
              <div
                className={`p-3 rounded-2xl border ${
                  isMale
                    ? 'bg-emerald-50/40 border-emerald-200/60'
                    : 'bg-rose-50/40 border-rose-200/60'
                }`}
              >
                <span
                  className={`text-[11px] font-extrabold block mb-0.5 ${
                    isMale ? 'text-emerald-900' : 'text-rose-900'
                  }`}
                >
                  المواصفات المطلوبة في {isMale ? 'شريكة الحياة' : 'شريك الحياة'}:
                </span>
                <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                  {partnerSpecs}
                </p>
              </div>
            )}
          </div>

          {/* صندوق البيانات السرية - يظهر للإدارة فقط */}
          {isAdminView && (
            <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-950 font-extrabold border-b border-amber-200 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  البيانات السرية وصور البطاقات (للإدارة فقط)
                </span>
                <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-amber-200">
                  المرسل: {sender}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                <div>
                  <span className="text-stone-500">كود متابعة العضو: </span>
                  <span className="font-mono font-bold text-amber-900">{item.trackingCode || '—'}</span>
                </div>
                <div>
                  <span className="text-stone-500">الكود المعتمد: </span>
                  <span className="font-mono font-bold text-emerald-900">{item.approvedCode || 'لم يعتمد بعد'}</span>
                </div>
                <div>
                  <span className="text-stone-500">هاتف صاحب الاستمارة: </span>
                  <span className="font-mono font-bold text-emerald-900">{secretPhone || 'غير مدرج'}</span>
                </div>
                {secretGuardianPhone && (
                  <div>
                    <span className="text-stone-500">هاتف ولي الأمر: </span>
                    <span className="font-mono font-bold text-emerald-900">{secretGuardianPhone}</span>
                  </div>
                )}
                <div className="sm:col-span-2 truncate">
                  <span className="text-stone-500">حساب الفيسبوك: </span>
                  <span className="font-mono text-sky-800">{secretFb || 'غير مدرج'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-1 bg-white rounded-lg border border-amber-200 text-[11px] font-semibold flex items-center gap-1 text-stone-700">
                  <ImageIcon className="w-3 h-3 text-emerald-700" />
                  بطاقة أمامية: {idFront ? 'مرفقة ✓' : 'غير مرفقة'}
                </span>
                <span className="px-2 py-1 bg-white rounded-lg border border-amber-200 text-[11px] font-semibold flex items-center gap-1 text-stone-700">
                  <ImageIcon className="w-3 h-3 text-emerald-700" />
                  بطاقة خلفية: {idBack ? 'مرفقة ✓' : 'غير مرفقة'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* أزرار أسفل البطاقة */}
      <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSelect}
          className={`flex-1 text-white text-xs sm:text-sm font-extrabold py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition ${
            isMale
              ? 'bg-emerald-900 hover:bg-emerald-800'
              : 'bg-rose-800 hover:bg-rose-700'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>
            {isAdminView ? 'مراجعة الاستمارة الكاملة' : 'عرض التفاصيل الكاملة للاستمارة'}
          </span>
        </button>

        {isAdminView && (
          <div className="flex flex-wrap items-center gap-1.5">
            {item.status !== 'معتمد' ? (
              <button
                type="button"
                onClick={onApprove}
                className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-sm transition"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>اعتماد وتوليد الكود</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onReturnToPending}
                className="px-3 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition"
              >
                إرجاع للمراجعة
              </button>
            )}

            <button
              type="button"
              onClick={onCopyPost}
              title="نسخ نص الاستمارة للنشر على فيسبوك وتليجرام بدون البيانات السرية"
              className="px-3 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold flex items-center gap-1 transition"
            >
              {copiedId === item.id ? (
                <Check className="w-4 h-4 text-emerald-700" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>نسخ للنشر</span>
            </button>

            <button
              type="button"
              onClick={onDelete}
              title="حذف الاستمارة"
              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// نافذة عرض جميع تفاصيل الاستمارة (تصميم مطور، منظم في بطاقات وشبكات أنيقة)
// ============================================================================

function ApplicationDetailsModal({
  item,
  isAdmin,
  onClose,
  onCopyPost,
  onApprove,
  onReturnToPending
}) {
  const isMale = item.q1_gender === 'عريس (ذكر)';
  const birthDate = isMale ? item.q7_maleBirthDate : item.q80_femaleBirthDate;
  const age = calculateAgeFromDate(birthDate);
  const status = isMale ? item.q6_maleMaritalStatus : item.q79_femaleMaritalStatus;
  const gov = isMale ? item.q27_maleBirthGov : item.q87_femaleBirthGov;
  const edu = isMale ? item.q2_maleEduLevel : item.q75_femaleEduLevel;
  const faculty = isMale ? item.q5_maleFaculty : item.q78_femaleFaculty;

  const InfoCardItem = ({ label, value, fullWidth = false }) => {
    const formatted = Array.isArray(value) ? value.join('، ') : value;
    return (
      <div
        className={`p-3 rounded-2xl bg-white border border-stone-200/80 shadow-sm ${
          fullWidth ? 'sm:col-span-2 lg:col-span-3' : ''
        }`}
      >
        <span className="text-[11px] font-bold text-stone-400 block mb-1">{label}</span>
        <span className="text-xs sm:text-sm font-extrabold text-stone-800 leading-relaxed block">
          {formatted || '—'}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 overflow-y-auto">
      <div
        dir="rtl"
        className="bg-stone-50 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* رأس النافذة المطور */}
        <div
          className={`px-6 py-5 text-white flex flex-wrap items-center justify-between gap-4 ${
            isMale
              ? 'bg-gradient-to-l from-emerald-950 via-emerald-900 to-teal-900'
              : 'bg-gradient-to-l from-rose-950 via-rose-900 to-pink-900'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl shadow-inner">
              {isMale ? '🤵' : '👰'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl">
                  بطاقة بيانات {item.q1_gender}
                </h3>
                {item.approvedCode ? (
                  <span className="font-mono text-xs sm:text-sm font-extrabold bg-amber-400 text-emerald-950 px-3 py-1 rounded-xl shadow">
                    كود الاستمارة المعتمد: {item.approvedCode}
                  </span>
                ) : (
                  <span className="font-mono text-xs font-extrabold bg-white/20 text-amber-200 px-3 py-1 rounded-xl">
                    كود المتابعة (قيد المراجعة): {item.trackingCode || item.id}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/85 mt-1.5">
                <span>الحالة الاجتماعية: <strong>{status}</strong></span>
                <span>•</span>
                <span>المحافظة: <strong>{gov} ({GOV_CODES[gov] || 'EGY'})</strong></span>
                <span>•</span>
                <span>السن: <strong>{age ? `${age} سنة` : birthDate || '—'}</strong></span>
                <span>•</span>
                <span>تاريخ التسجيل: {item.createdAt}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم النافذة القابل للتمرير بتصميم البطاقات الشبكية المنظمة */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* شريط شرح هيكل الكود المعتمد */}
          {item.approvedCode && (
            <div className="bg-emerald-900/5 border border-emerald-800/20 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-950">
              <div className="flex items-center gap-2 font-bold">
                <BadgeCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  كود الاستمارة المعتمد ({item.approvedCode}) يرمز إلى: المحافظة ({GOV_CODES[gov] || 'EGY'}) + النوع والحالة وسنة الميلاد + الرقم التسلسلي.
                </span>
              </div>
              {isAdmin && item.trackingCode && (
                <span className="font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                  كود متابعة العضو: {item.trackingCode}
                </span>
              )}
            </div>
          )}

          {isMale ? (
            <>
              {/* القسم 1: المؤهل والتعليم */}
              <div className="bg-stone-100/80 p-5 rounded-3xl border border-stone-200/80 space-y-3">
                <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-700" />
                  <span>أولاً: المستوى التعليمي والمؤهل الدراسي</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="المستوى التعليمي" value={item.q2_maleEduLevel} />
                  {item.q2_maleEduLevel === 'مؤهل جامعي (عالي)' && (
                    <>
                      <InfoCardItem label="نوع الدرجة العلمية" value={item.q3_maleDegreeType} />
                      <InfoCardItem label="اسم الجامعة" value={item.q4_maleUniversity} />
                      <InfoCardItem label="اسم الكلية / التخصص" value={item.q5_maleFaculty} fullWidth />
                    </>
                  )}
                </div>
              </div>

              {/* القسم 2: المواصفات العامة والشخصية */}
              <div className="bg-stone-100/80 p-5 rounded-3xl border border-stone-200/80 space-y-3">
                <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <span>ثانياً: البيانات الأساسية والمواصفات العامة للعريس</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="الحالة الاجتماعية" value={item.q6_maleMaritalStatus} />
                  <InfoCardItem label="تاريخ الميلاد والسن" value={`${item.q7_maleBirthDate || '—'}${age ? ` (${age} سنة)` : ''}`} />
                  <InfoCardItem label="الطول والوزن" value={`${item.q9_maleHeight || '—'} سم / ${item.q8_maleWeight || '—'} كجم`} />
                  <InfoCardItem label="لون البشرة" value={item.q10_maleSkinColor} />
                  <InfoCardItem label="الاهتمام بالمظهر والنظافة" value={item.q11_maleHygiene} />
                  <InfoCardItem label="اللحية" value={item.q12_maleBeard} />
                  <InfoCardItem label="ممارسة الرياضة" value={item.q13_maleSport} />
                  <InfoCardItem label="الحالة الصحية (أمراض)" value={item.q14_maleDiseases} />
                  <InfoCardItem label="الرغبة في الإنجاب" value={item.q15_maleKidsGoal} />
                </div>
              </div>

              {/* القسم 3: العمل والأسرة والسكن */}
              <div className="bg-stone-100/80 p-5 rounded-3xl border border-stone-200/80 space-y-3">
                <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-700" />
                  <span>ثالثاً: العمل والوضع الاجتماعي والأسرة والسكن</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="العمل الفعلي" value={item.q16_maleActualJob} />
                  <InfoCardItem label="نوع العمل" value={item.q17_maleJobType} />
                  <InfoCardItem label="مستوى الدخل" value={item.q19_maleIncome} />
                  <InfoCardItem label="ملحوظات بخصوص العمل" value={item.q18_maleJobNotes} fullWidth />
                  <InfoCardItem label="هل سبق الخطوبة أو الزواج؟" value={item.q20_malePrevEngaged} />
                  <InfoCardItem label="الرغبة في التعدد" value={item.q21_malePolygamyDesire} />
                  <InfoCardItem label="عمل الوالد" value={item.q22_maleFatherJob} />
                  <InfoCardItem label="عمل الوالدة" value={item.q23_maleMotherJob} />
                  <InfoCardItem label="عدد الإخوة والأخوات" value={`الأخوة: ${item.q24_maleBrothersCount || '0'} | الأخوات: ${item.q25_maleSistersCount || '0'}`} />
                  <InfoCardItem label="مستوى تعليم الإخوة" value={item.q26_maleSiblingsEdu} />
                  <InfoCardItem label="محافظة الميلاد" value={item.q27_maleBirthGov} />
                  <InfoCardItem label="مكان السكن والإقامة الحالي" value={item.q28_maleCurrentResidence} />
                  <InfoCardItem label="اسم وشكل المنطقة" value={`${item.q29_maleDistrictName || '—'} (${item.q30_maleDistrictType || '—'})`} />
                  <InfoCardItem label="مكان سكن الزوجية" value={item.q31_maleMaritalHome} />
                  <InfoCardItem label="نظام السكن" value={item.q32_maleHousingSystem} />
                </div>
              </div>

              {/* القسم 4: التدين والالتزام والنبذة */}
              <div className="bg-stone-100/80 p-5 rounded-3xl border border-stone-200/80 space-y-3">
                <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <span>رابعاً: بيانات التدين والالتزام والنبذة الشخصية</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="مستوى التدين" value={item.q33_maleReligiosity} />
                  <InfoCardItem label="المحافظة على الصلوات" value={item.q34_malePrayer} />
                  <InfoCardItem label="التدخين" value={item.q35_maleSmoking} />
                  <InfoCardItem label="مقدار الحفظ من القرآن" value={item.q36_maleQuran} />
                  <InfoCardItem label="مشاهدة الأفلام والمسلسلات" value={item.q37_maleMovies} />
                  <InfoCardItem label="الاستماع للأغاني" value={item.q38_maleSongs} />
                  <InfoCardItem label="الدعاة والعلماء الذين يستمع لهم" value={item.q39_malePreachers} fullWidth />
                  <InfoCardItem label="دراسة العلم الشرعي" value={item.q40_maleIslamicStudy} fullWidth />
                  <InfoCardItem label="تكلم عن نفسك أو ما يقوله الناس عنك" value={item.q41_maleAboutSelf} fullWidth />
                  <InfoCardItem label="إضافات أو ملاحظات عامة" value={item.q42_maleBasicNotes} fullWidth />
                </div>
              </div>

              {/* الأقسام الشرطية للمتزوج / المطلق / الأرمل */}
              {(item.q6_maleMaritalStatus === 'متزوج' ||
                item.q6_maleMaritalStatus === 'منفصل بدون طلاق') && (
                <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 space-y-3">
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    بيانات إضافية خاصة بالمتزوج / المنفصل بدون طلاق
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoCardItem label="عدد مرات الزواج" value={item.q43_maleMarriagesCount} />
                    <InfoCardItem label="كم زوجة على ذمتك" value={item.q44_maleCurrentWivesCount} />
                    <InfoCardItem label="هل الزواج بعلم الزوجة الأولى؟" value={item.q45_maleFirstWifeKnows} />
                    <InfoCardItem label="ملاحظات إضافية" value={item.q46_malePolyNotes} fullWidth />
                  </div>
                </div>
              )}

              {item.q6_maleMaritalStatus === 'مطلق' && (
                <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 space-y-3">
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    بيانات إضافية خاصة بالمطلق
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoCardItem label="عدد مرات الزواج" value={item.q48_maleMarriagesCount} />
                    <InfoCardItem label="الأولاد وعددهم" value={item.q49_maleHasKidsCount} />
                    <InfoCardItem label="أعمارهم وحضانتهم" value={item.q50_maleKidsAgesCustody} />
                    <InfoCardItem label="ملاحظات إضافية" value={item.q51_maleDivorcedNotes} fullWidth />
                  </div>
                </div>
              )}

              {item.q6_maleMaritalStatus === 'أرمل' && (
                <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 space-y-3">
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    بيانات إضافية خاصة بالأرمل
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoCardItem label="عدد مرات الزواج" value={item.q53_maleMarriagesCount} />
                    <InfoCardItem label="الأولاد وعددهم" value={item.q54_maleHasKidsCount} />
                    <InfoCardItem label="أعمارهم وحضانتهم" value={item.q55_maleKidsAgesCustody} />
                    <InfoCardItem label="ملاحظات إضافية" value={item.q56_maleWidowerNotes} fullWidth />
                  </div>
                </div>
              )}

              {/* القسم 5: مواصفات شريكة الحياة */}
              <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-200 space-y-3">
                <h4 className="font-extrabold text-emerald-950 text-sm flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-700" />
                  <span>خامساً: المواصفات المطلوبة في شريكة الحياة</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="المواصفات العامة المطلوبة" value={item.q63_malePartnerSpecs} fullWidth />
                  <InfoCardItem label="السن المناسب" value={item.q64_malePartnerAge} />
                  <InfoCardItem label="لون البشرة المطلوب" value={item.q65_malePartnerSkin} />
                  <InfoCardItem label="الحالة الاجتماعية المطلوبة" value={item.q66_malePartnerStatus} />
                  <InfoCardItem label="القبول بمطلقة أطفالها مع والدهم" value={item.q67_maleAcceptDivorcedDadCustody} />
                  <InfoCardItem label="القبول بمطلقة أو أرملة معها أطفال" value={item.q68_maleAcceptWithKids} />
                  <InfoCardItem label="الزواج من محافظة أخرى" value={item.q69_maleAcceptOtherGov} />
                  <InfoCardItem label="الحجاب أم النقاب" value={item.q70_malePartnerHijabPref} />
                  <InfoCardItem label="المؤهل المطلوب" value={item.q71_malePartnerEduPref} />
                  <InfoCardItem label="عمل الزوجة" value={item.q72_malePartnerWorkPref} />
                  <InfoCardItem label="نظام قائمة المنقولات" value={item.q73_maleQaymaPref} fullWidth />
                  <InfoCardItem label="إضافات أو ملاحظات أخرى" value={item.q74_malePartnerNotes} fullWidth />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* العروسة - القسم 1: التعليم */}
              <div className="bg-stone-100/80 p-5 rounded-3xl border border-stone-200/80 space-y-3">
                <h4 className="font-extrabold text-rose-950 text-sm flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-rose-700" />
                  <span>أولاً: المستوى التعليمي والمؤهل الدراسي للعروسة</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="المستوى التعليمي" value={item.q75_femaleEduLevel} />
                  {item.q75_femaleEduLevel === 'مؤهل جامعي (عالي)' && (
                    <>
                      <InfoCardItem label="نوع الدرجة العلمية" value={item.q76_femaleDegreeType} />
                      <InfoCardItem label="اسم الجامعة" value={item.q77_femaleUniversity} />
                      <InfoCardItem label="اسم الكلية / التخصص" value={item.q78_femaleFaculty} fullWidth />
                    </>
                  )}
                </div>
              </div>

              {/* العروسة - القسم 2: المواصفات العامة والسكن والعمل */}
              <div className="bg-stone-100/80 p-5 rounded-3xl border border-stone-200/80 space-y-3">
                <h4 className="font-extrabold text-rose-950 text-sm flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-700" />
                  <span>ثانياً: البيانات الأساسية والمواصفات العامة والسكن والعمل</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="الحالة الاجتماعية" value={item.q79_femaleMaritalStatus} />
                  <InfoCardItem label="تاريخ الميلاد والسن" value={`${item.q80_femaleBirthDate || '—'}${age ? ` (${age} سنة)` : ''}`} />
                  <InfoCardItem label="الطول والوزن" value={`${item.q82_femaleHeight || '—'} سم / ${item.q81_femaleWeight || '—'} كجم`} />
                  <InfoCardItem label="لون البشرة" value={item.q83_femaleSkinColor} />
                  <InfoCardItem label="الاهتمام بالمظهر والنظافة" value={item.q84_femaleHygiene} />
                  <InfoCardItem label="درجة الجمال" value={item.q85_femaleBeauty} />
                  <InfoCardItem label="الحالة الصحية" value={item.q86_femaleDiseases} />
                  <InfoCardItem label="محافظة الميلاد" value={item.q87_femaleBirthGov} />
                  <InfoCardItem label="مكان السكن والإقامة الحالي" value={item.q88_femaleCurrentResidence} />
                  <InfoCardItem label="اسم وشكل المنطقة" value={`${item.q89_femaleDistrictName || '—'} (${item.q90_femaleDistrictType || '—'})`} />
                  <InfoCardItem label="العمل الفعلي" value={item.q91_femaleActualJob} />
                  <InfoCardItem label="نوع العمل" value={item.q92_femaleJobType} />
                  <InfoCardItem label="هل سبق الارتباط (خطوبة أو عقد)؟" value={item.q93_femalePrevEngaged} />
                  <InfoCardItem label="القبول بالزواج من رجل متزوج" value={item.q94_femaleAcceptMarriedMan} />
                  <InfoCardItem label="الرغبة في الإنجاب" value={item.q95_femaleKidsGoal} />
                </div>
              </div>

              {/* العروسة - القسم 3: التدين والالتزام */}
              <div className="bg-stone-100/80 p-5 rounded-3xl border border-stone-200/80 space-y-3">
                <h4 className="font-extrabold text-rose-950 text-sm flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-rose-700" />
                  <span>ثالثاً: بيانات التدين والالتزام والنبذة الشخصية</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="مستوى التدين" value={item.q96_femaleReligiosity} />
                  <InfoCardItem label="المحافظة على الصلوات" value={item.q97_femalePrayer} />
                  <InfoCardItem label="مقدار الحفظ من القرآن" value={item.q98_femaleQuran} />
                  <InfoCardItem label="مشاهدة الأفلام والمسلسلات" value={item.q99_femaleMovies} />
                  <InfoCardItem label="الاستماع للأغاني" value={item.q100_femaleSongs} />
                  <InfoCardItem label="نوع الحجاب" value={item.q103_femaleHijabType} />
                  <InfoCardItem label="الاستعداد للنقاب" value={item.q104_femaleNiqabReady} />
                  <InfoCardItem label="الدعاة والعلماء الذين تستمع لهم" value={item.q101_femalePreachers} fullWidth />
                  <InfoCardItem label="دراسة العلم الشرعي" value={item.q102_femaleIslamicStudy} fullWidth />
                  <InfoCardItem label="تكلمي عن نفسكِ أو ما يقوله الناس عنكِ" value={item.q105_femaleAboutSelf} fullWidth />
                  <InfoCardItem label="إضافات أو ملاحظات عامة" value={item.q106_femaleGeneralNotes} fullWidth />
                </div>
              </div>

              {/* الأقسام الشرطية للمطلقة والأرملة */}
              {item.q79_femaleMaritalStatus === 'مطلقة' && (
                <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 space-y-3">
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    بيانات إضافية خاصة بالمطلقة
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoCardItem label="كم عاماً مضى على الطلاق؟" value={item.q125_femaleYearsSinceDivorce} />
                    <InfoCardItem label="عدد مرات الزواج" value={item.q127_femaleMarriagesCount} />
                    <InfoCardItem label="الأولاد وعددهم" value={item.q128_femaleHasKidsCount} />
                    <InfoCardItem label="أعمارهم وحضانتهم" value={item.q129_femaleKidsAgesCustody} />
                    <InfoCardItem label="الإنفاق عليهم بعد الزواج" value={item.q130_femaleKidsFinancialSupport} />
                    <InfoCardItem label="انتهاء العدة" value={item.q131_femaleEddaCompleted} />
                    <InfoCardItem label="ملاحظات إضافية" value={item.q132_femaleDivorcedNotes} fullWidth />
                  </div>
                </div>
              )}

              {item.q79_femaleMaritalStatus === 'أرملة' && (
                <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 space-y-3">
                  <h4 className="font-extrabold text-amber-950 text-sm">
                    بيانات إضافية خاصة بالأرملة
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InfoCardItem label="كم عاماً مضى على وفاة الزوج؟" value={item.q133_femaleYearsSinceDeath} />
                    <InfoCardItem label="عدد مرات الزواج" value={item.q135_femaleMarriagesCount} />
                    <InfoCardItem label="الأولاد وعددهم" value={item.q136_femaleHasKidsCount} />
                    <InfoCardItem label="أعمارهم وحضانتهم" value={item.q137_femaleKidsAgesCustody} />
                    <InfoCardItem label="الإنفاق عليهم بعد الزواج" value={item.q138_femaleKidsFinancialSupport} />
                    <InfoCardItem label="انتهاء العدة" value={item.q139_femaleEddaCompleted} />
                    <InfoCardItem label="ملاحظات إضافية" value={item.q140_femaleWidowNotes} fullWidth />
                  </div>
                </div>
              )}

              {/* العروسة - القسم 4: مواصفات شريك الحياة */}
              <div className="bg-rose-50/50 p-5 rounded-3xl border border-rose-200 space-y-3">
                <h4 className="font-extrabold text-rose-950 text-sm flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-700" />
                  <span>رابعاً: المواصفات المطلوبة في شريك الحياة</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoCardItem label="المواصفات العامة المطلوبة" value={item.q107_femalePartnerSpecs} fullWidth />
                  <InfoCardItem label="السن المناسب" value={item.q108_femalePartnerAge} />
                  <InfoCardItem label="المؤهل المطلوب" value={item.q109_femalePartnerEdu} />
                  <InfoCardItem label="لون البشرة المطلوب" value={item.q110_femalePartnerSkin} />
                  <InfoCardItem label="الحالة الاجتماعية المقبولة للعريس" value={item.q111_femalePartnerStatus} />
                  <InfoCardItem label="مطلق أو أرمل بدون أطفال" value={item.q112_femaleAcceptNoKids} />
                  <InfoCardItem label="مطلق أو أرمل أطفاله في حضانته" value={item.q113_femaleAcceptHisCustody} />
                  <InfoCardItem label="مطلق أطفاله في حضانة والدتهم" value={item.q114_femaleAcceptMomCustody} />
                  <InfoCardItem label="القبول من محافظة أخرى" value={item.q115_femaleAcceptOtherGov} />
                  <InfoCardItem label="شروط خاصة بـ (اللحية - التدخين - السكن)" value={item.q116_femaleSpecialConditions} fullWidth />
                  <InfoCardItem label="موقف الأهل والعروسة من القائمة" value={item.q117_femaleQaymaPref} fullWidth />
                  <InfoCardItem label="شروط أو ملاحظات خاصة بالقائمة والمهر" value={item.q118_femaleQaymaNotes} fullWidth />
                </div>
              </div>
            </>
          )}

          {/* القسم السري داخل النافذة: يظهر للإدارة فقط */}
          {isAdmin ? (
            <div className="bg-amber-50 p-5 rounded-3xl border-2 border-amber-400 space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-extrabold text-sm">
                <Shield className="w-5 h-5 text-amber-700" />
                <span>القسم السري الخاص بالإدارة (المرسل، أرقام الهواتف، الحسابات، وصور البطاقات)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <InfoCardItem label="كود متابعة العضو" value={item.trackingCode} />
                <InfoCardItem label="كود الاستمارة المعتمد" value={item.approvedCode || 'لم يعتمد بعد'} />
                <InfoCardItem label="حالة الاستمارة" value={item.status} />

                {isMale ? (
                  <>
                    <InfoCardItem label="من مرسل الاستمارة" value={item.q57_maleSender} />
                    {item.q57_maleSender === 'أحد الاقارب' && (
                      <>
                        <InfoCardItem label="صلة القرابة" value={item.q58_maleRelativeType} />
                        <InfoCardItem label="بعلم العريس؟" value={item.q59_maleWithGroomKnowledge} />
                        <InfoCardItem label="بطاقة المرسل (أمامي)" value={item.q60_maleRelativeIdFront} />
                        <InfoCardItem label="بطاقة المرسل (خلفي)" value={item.q61_maleRelativeIdBack} />
                        <InfoCardItem label="ملحوظة القريب" value={item.q62_maleRelativeNotes} />
                      </>
                    )}
                    <InfoCardItem label="بطاقة العريس (أمامي)" value={item.q141_maleIdFront} />
                    <InfoCardItem label="بطاقة العريس (خلفي)" value={item.q142_maleIdBack} />
                    <InfoCardItem label="رقم الهاتف السري للعريس" value={item.q143_maleSecretPhone} />
                    <InfoCardItem label="حساب الفيسبوك السري" value={item.q144_maleSecretFb} />
                    <InfoCardItem label="الصورة الشخصية الحديثة" value={item.q145_malePersonalPhoto} />
                    <InfoCardItem label="الموافقة على النشر بفيسبوك" value={item.q146_malePublishFb} />
                    <InfoCardItem label="الموافقة على النشر بتليجرام" value={item.q147_malePublishTelegram} />
                    <InfoCardItem label="مراسلة سابقة من حساب آخر" value={item.q148_malePrevContact} />
                    <InfoCardItem label="ملاحظات ختامية" value={item.q149_maleFinalNotes} fullWidth />
                  </>
                ) : (
                  <>
                    <InfoCardItem label="من قام بملء الاستمارة" value={item.q119_femaleSender} />
                    {item.q119_femaleSender === 'أحد الأقارب' && (
                      <>
                        <InfoCardItem label="صلة القرابة" value={item.q120_femaleRelativeType} />
                        <InfoCardItem label="بعلم العروسة؟" value={item.q121_femaleWithBrideKnowledge} />
                        <InfoCardItem label="بطاقة المرسل (أمامي)" value={item.q122_femaleRelativeIdFront} />
                        <InfoCardItem label="بطاقة المرسل (خلفي)" value={item.q123_femaleRelativeIdBack} />
                        <InfoCardItem label="ملحوظة القريب" value={item.q124_femaleRelativeNotes} />
                      </>
                    )}
                    <InfoCardItem label="رقم هاتف العروسة السري" value={item.q151_femaleSecretPhone} />
                    <InfoCardItem label="رقم هاتف ولي الأمر السري" value={item.q152_femaleGuardianSecretPhone} />
                    <InfoCardItem label="حساب الفيسبوك السري" value={item.q153_femaleSecretFb} />
                    <InfoCardItem label="بطاقة العروسة (أمامي)" value={item.q154_femaleIdFront} />
                    <InfoCardItem label="بطاقة العروسة (خلفي)" value={item.q155_femaleIdBack} />
                    <InfoCardItem label="الصورة الشخصية الحديثة" value={item.q156_femalePersonalPhoto} />
                    <InfoCardItem label="الموافقة على النشر بفيسبوك" value={item.q157_femalePublishFb} />
                    <InfoCardItem label="الموافقة على النشر بتليجرام" value={item.q158_femalePublishTelegram} />
                    <InfoCardItem label="مراسلة سابقة من حساب آخر" value={item.q159_femalePrevContact} />
                    <InfoCardItem label="ملاحظات ختامية" value={item.q160_femaleFinalNotes} fullWidth />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950 text-white p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  هل ترغب في التقدم لهذه الاستمارة؟
                </h4>
                <p className="text-xs text-emerald-100">
                  أرقام الهواتف وبيانات التواصل محفوظة بسرية تامة لدى إدارة الصفحة ولا تُرسل إلا بعد أخذ الموافقة الشخصية.
                </p>
              </div>
              <span className="font-mono text-xs bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 shrink-0">
                كود الاستمارة المعتمد: {item.approvedCode || item.id}
              </span>
            </div>
          )}
        </div>

        {/* ذيل النافذة */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
          {isAdmin ? (
            <div className="flex flex-wrap items-center gap-2">
              {item.status !== 'معتمد' ? (
                <button
                  type="button"
                  onClick={onApprove}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>اعتماد الاستمارة وتوليد كود المحافظة المعتمد</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onReturnToPending}
                  className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs"
                >
                  إرجاع لقائمة قيد المراجعة
                </button>
              )}

              <button
                type="button"
                onClick={onCopyPost}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>نسخ نص الاستمارة للنشر (بدون البيانات السرية)</span>
              </button>
            </div>
          ) : (
            <span className="text-xs text-stone-500">ميثاق ود - جميع الحقوق محفوظة</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// معالج تسجيل الاستمارة الذكي (مطابق حرفياً لنظام الأسئلة والتفرعات في الـ PDF)
// ============================================================================

function RegistrationWizard({ isAdmin, onSubmitApplication }) {
  const [form, setForm] = useState({
    q1_gender: '',
    q2_maleEduLevel: '',
    q3_maleDegreeType: '',
    q4_maleUniversity: '',
    q5_maleFaculty: '',
    q6_maleMaritalStatus: '',
    q7_maleBirthDate: '',
    q8_maleWeight: '',
    q9_maleHeight: '',
    q10_maleSkinColor: '',
    q11_maleHygiene: '',
    q12_maleBeard: '',
    q13_maleSport: '',
    q14_maleDiseases: '',
    q15_maleKidsGoal: '',
    q16_maleActualJob: '',
    q17_maleJobType: [],
    q18_maleJobNotes: '',
    q19_maleIncome: '',
    q20_malePrevEngaged: '',
    q21_malePolygamyDesire: '',
    q22_maleFatherJob: '',
    q23_maleMotherJob: '',
    q24_maleBrothersCount: '',
    q25_maleSistersCount: '',
    q26_maleSiblingsEdu: '',
    q27_maleBirthGov: '',
    q28_maleCurrentResidence: '',
    q29_maleDistrictName: '',
    q30_maleDistrictType: '',
    q31_maleMaritalHome: '',
    q32_maleHousingSystem: '',
    q33_maleReligiosity: '',
    q34_malePrayer: '',
    q35_maleSmoking: '',
    q36_maleQuran: '',
    q37_maleMovies: '',
    q38_maleSongs: '',
    q39_malePreachers: '',
    q40_maleIslamicStudy: '',
    q41_maleAboutSelf: '',
    q42_maleBasicNotes: '',
    q43_maleMarriagesCount: '',
    q44_maleCurrentWivesCount: '',
    q45_maleFirstWifeKnows: '',
    q46_malePolyNotes: '',
    q47_maleDivorceCert: '',
    q48_maleMarriagesCount: '',
    q49_maleHasKidsCount: '',
    q50_maleKidsAgesCustody: '',
    q51_maleDivorcedNotes: '',
    q52_maleDeathCert: '',
    q53_maleMarriagesCount: '',
    q54_maleHasKidsCount: '',
    q55_maleKidsAgesCustody: '',
    q56_maleWidowerNotes: '',
    q57_maleSender: '',
    q58_maleRelativeType: '',
    q59_maleWithGroomKnowledge: '',
    q60_maleRelativeIdFront: '',
    q61_maleRelativeIdBack: '',
    q62_maleRelativeNotes: '',
    q63_malePartnerSpecs: '',
    q64_malePartnerAge: '',
    q65_malePartnerSkin: '',
    q66_malePartnerStatus: [],
    q67_maleAcceptDivorcedDadCustody: '',
    q68_maleAcceptWithKids: '',
    q69_maleAcceptOtherGov: '',
    q70_malePartnerHijabPref: '',
    q71_malePartnerEduPref: '',
    q72_malePartnerWorkPref: '',
    q73_maleQaymaPref: '',
    q74_malePartnerNotes: '',
    q75_femaleEduLevel: '',
    q76_femaleDegreeType: '',
    q77_femaleUniversity: '',
    q78_femaleFaculty: '',
    q79_femaleMaritalStatus: '',
    q80_femaleBirthDate: '',
    q81_femaleWeight: '',
    q82_femaleHeight: '',
    q83_femaleSkinColor: '',
    q84_femaleHygiene: '',
    q85_femaleBeauty: '',
    q86_femaleDiseases: '',
    q87_femaleBirthGov: '',
    q88_femaleCurrentResidence: '',
    q89_femaleDistrictName: '',
    q90_femaleDistrictType: '',
    q91_femaleActualJob: '',
    q92_femaleJobType: '',
    q93_femalePrevEngaged: '',
    q94_femaleAcceptMarriedMan: '',
    q95_femaleKidsGoal: '',
    q96_femaleReligiosity: '',
    q97_femalePrayer: '',
    q98_femaleQuran: '',
    q99_femaleMovies: '',
    q100_femaleSongs: '',
    q101_femalePreachers: '',
    q102_femaleIslamicStudy: '',
    q103_femaleHijabType: '',
    q104_femaleNiqabReady: '',
    q105_femaleAboutSelf: '',
    q106_femaleGeneralNotes: '',
    q107_femalePartnerSpecs: '',
    q108_femalePartnerAge: '',
    q109_femalePartnerEdu: '',
    q110_femalePartnerSkin: '',
    q111_femalePartnerStatus: [],
    q112_femaleAcceptNoKids: '',
    q113_femaleAcceptHisCustody: '',
    q114_femaleAcceptMomCustody: '',
    q115_femaleAcceptOtherGov: '',
    q116_femaleSpecialConditions: '',
    q117_femaleQaymaPref: '',
    q118_femaleQaymaNotes: '',
    q119_femaleSender: '',
    q120_femaleRelativeType: '',
    q121_femaleWithBrideKnowledge: '',
    q122_femaleRelativeIdFront: '',
    q123_femaleRelativeIdBack: '',
    q124_femaleRelativeNotes: '',
    q125_femaleYearsSinceDivorce: '',
    q126_femaleDivorceCert: '',
    q127_femaleMarriagesCount: '',
    q128_femaleHasKidsCount: '',
    q129_femaleKidsAgesCustody: '',
    q130_femaleKidsFinancialSupport: '',
    q131_femaleEddaCompleted: '',
    q132_femaleDivorcedNotes: '',
    q133_femaleYearsSinceDeath: '',
    q134_femaleDeathCert: '',
    q135_femaleMarriagesCount: '',
    q136_femaleHasKidsCount: '',
    q137_femaleKidsAgesCustody: '',
    q138_femaleKidsFinancialSupport: '',
    q139_femaleEddaCompleted: '',
    q140_femaleWidowNotes: '',
    q141_maleIdFront: '',
    q142_maleIdBack: '',
    q143_maleSecretPhone: '',
    q144_maleSecretFb: '',
    q145_malePersonalPhoto: '',
    q146_malePublishFb: '',
    q147_malePublishTelegram: '',
    q148_malePrevContact: '',
    q149_maleFinalNotes: '',
    q150_malePledge: false,
    q151_femaleSecretPhone: '',
    q152_femaleGuardianSecretPhone: '',
    q153_femaleSecretFb: '',
    q154_femaleIdFront: '',
    q155_femaleIdBack: '',
    q156_femalePersonalPhoto: '',
    q157_femalePublishFb: '',
    q158_femalePublishTelegram: '',
    q159_femalePrevContact: '',
    q160_femaleFinalNotes: '',
    q161_femalePledge: false
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [stepError, setStepError] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStepError('');
  };

  const toggleCheckboxArray = (key, optionValue) => {
    setForm((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      const exists = current.includes(optionValue);
      const next = exists
        ? current.filter((item) => item !== optionValue)
        : [...current, optionValue];
      return { ...prev, [key]: next };
    });
    setStepError('');
  };

  const activeSections = useMemo(() => {
    const sections = [{ id: 'sec3_router', title: 'القسم 3: تحديد الحالة' }];

    if (form.q1_gender === 'عريس (ذكر)') {
      sections.push({ id: 'sec_male_edu', title: 'أولاً: المستوى التعليمي للعريس' });

      if (form.q2_maleEduLevel === 'مؤهل جامعي (عالي)') {
        sections.push({ id: 'sec_male_uni', title: 'تفاصيل المؤهل الجامعي' });
      }

      if (form.q2_maleEduLevel) {
        sections.push({ id: 'sec_male_basic', title: 'ثانياً: البيانات الأساسية للعريس' });
      }

      if (
        form.q6_maleMaritalStatus === 'متزوج' ||
        form.q6_maleMaritalStatus === 'منفصل بدون طلاق'
      ) {
        sections.push({ id: 'sec_male_poly', title: 'بيانات إضافية (للمتزوج)' });
      } else if (form.q6_maleMaritalStatus === 'مطلق') {
        sections.push({ id: 'sec_male_divorced', title: 'بيانات إضافية (للمطلق)' });
      } else if (form.q6_maleMaritalStatus === 'أرمل') {
        sections.push({ id: 'sec_male_widower', title: 'بيانات إضافية (للأرمل)' });
      }

      if (form.q6_maleMaritalStatus) {
        sections.push({ id: 'sec_male_partner', title: 'ثامناً: البيانات الخاصة بشريكة الحياة' });
        sections.push({ id: 'sec_male_sender', title: 'بيانات مرسل الاستمارة' });

        if (form.q57_maleSender === 'أحد الاقارب') {
          sections.push({ id: 'sec_male_relative', title: 'بيانات القريب (المرسل)' });
        }

        if (form.q57_maleSender) {
          sections.push({ id: 'sec_male_conclusion', title: 'خاتمة وتعهد' });
        }
      }
    } else if (form.q1_gender === 'عروسة (أنثى)') {
      sections.push({ id: 'sec_female_edu', title: 'أولاً: المستوى التعليمي للعروسة' });

      if (form.q75_femaleEduLevel === 'مؤهل جامعي (عالي)') {
        sections.push({ id: 'sec_female_uni', title: 'تفاصيل المؤهل الجامعي (للعروسة)' });
      }

      if (form.q75_femaleEduLevel) {
        sections.push({ id: 'sec_female_basic', title: 'ثانياً: البيانات الأساسية للعروسة' });
      }

      if (form.q79_femaleMaritalStatus === 'مطلقة') {
        sections.push({ id: 'sec_female_divorced', title: 'بيانات امرأة - مطلقة' });
      } else if (form.q79_femaleMaritalStatus === 'أرملة') {
        sections.push({ id: 'sec_female_widow', title: 'بيانات امرأة - أرملة' });
      }

      if (form.q79_femaleMaritalStatus) {
        sections.push({ id: 'sec_female_sender', title: 'بيانات مرسل الاستمارة (للعروسة)' });

        if (form.q119_femaleSender === 'أحد الأقارب') {
          sections.push({ id: 'sec_female_relative', title: 'بيانات القريب (للعروسة)' });
        }

        if (form.q119_femaleSender) {
          sections.push({ id: 'sec_female_conclusion', title: 'خاتمة وتعهد (للعروسة)' });
        }
      }
    }

    return sections;
  }, [
    form.q1_gender,
    form.q2_maleEduLevel,
    form.q6_maleMaritalStatus,
    form.q57_maleSender,
    form.q75_femaleEduLevel,
    form.q79_femaleMaritalStatus,
    form.q119_femaleSender
  ]);

  const currentSection = activeSections[stepIndex] || activeSections[0];

  const validateCurrentStep = () => {
    if (!currentSection) return false;
    const id = currentSection.id;

    if (id === 'sec3_router' && !form.q1_gender) {
      setStepError('يرجى اختيار "أنت: عريس (ذكر) أو عروسة (أنثى)" للمتابعة.');
      return false;
    }
    if (id === 'sec_male_edu' && !form.q2_maleEduLevel) {
      setStepError('يرجى اختيار المستوى التعليمي للعريس (سؤال إجباري *).');
      return false;
    }
    if (id === 'sec_male_uni') {
      if (!form.q3_maleDegreeType || !form.q4_maleUniversity || !form.q5_maleFaculty) {
        setStepError('يرجى استكمال نوع الدرجة العلمية واسم الجامعة واسم الكلية / التخصص (حقول إجبارية *).');
        return false;
      }
    }
    if (id === 'sec_male_basic' && !form.q6_maleMaritalStatus) {
      setStepError('يرجى تحديد حالتك الاجتماعية (سؤال إجباري *).');
      return false;
    }
    if (id === 'sec_male_sender' && !form.q57_maleSender) {
      setStepError('يرجى تحديد من مرسل الاستمارة.');
      return false;
    }
    if (id === 'sec_male_conclusion') {
      if (!form.q146_malePublishFb || !form.q147_malePublishTelegram || !form.q150_malePledge) {
        setStepError('يرجى الإجابة على أسئلة الموافقة على النشر والموافقة على الإقرار والتعهد (*).');
        return false;
      }
    }
    if (id === 'sec_female_edu' && !form.q75_femaleEduLevel) {
      setStepError('يرجى اختيار المستوى التعليمي للعروسة (سؤال إجباري *).');
      return false;
    }
    if (id === 'sec_female_uni') {
      if (!form.q76_femaleDegreeType || !form.q77_femaleUniversity || !form.q78_femaleFaculty) {
        setStepError('يرجى استكمال نوع الدرجة العلمية واسم الجامعة واسم الكلية / التخصص (حقول إجبارية *).');
        return false;
      }
    }
    if (id === 'sec_female_basic' && !form.q79_femaleMaritalStatus) {
      setStepError('يرجى تحديد حالتك الإجتماعية (سؤال إجباري *).');
      return false;
    }
    if (id === 'sec_female_divorced' && !form.q125_femaleYearsSinceDivorce.trim()) {
      setStepError('يرجى الإجابة على سؤال: كم عامًا مضى علي وقوع الطلاق ؟ (حقل إجباري *).');
      return false;
    }
    if (id === 'sec_female_sender' && !form.q119_femaleSender) {
      setStepError('يرجى تحديد من الذي قام بملء هذه الاستمارة (حقل إجباري *).');
      return false;
    }
    if (id === 'sec_female_relative') {
      if (!form.q120_femaleRelativeType || !form.q121_femaleWithBrideKnowledge) {
        setStepError('يرجى تحديد صلة القرابة وهل ملء الاستمارة تم بعلم العروسة (حقول إجبارية *).');
        return false;
      }
    }
    if (id === 'sec_female_conclusion') {
      if (!form.q157_femalePublishFb || !form.q158_femalePublishTelegram || !form.q161_femalePledge) {
        setStepError('يرجى الإجابة على أسئلة الموافقة على النشر والموافقة على الإقرار والتعهد (*).');
        return false;
      }
    }

    setStepError('');
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (stepIndex < activeSections.length - 1) {
      setStepIndex(stepIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onSubmitApplication(form);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepError('');
      setStepIndex(stepIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLastStep =
    currentSection &&
    (currentSection.id === 'sec_male_conclusion' ||
      currentSection.id === 'sec_female_conclusion');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                استمارة ميثاق ود الرسمية (تُراجع من الإدارة قبل النشر)
              </span>
              {isAdmin && (
                <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                  وضع الأدمن: يمكنك تسجيل أي عدد من الاستمارات بدون حد يومي
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-800 mt-2">
              {currentSection?.title}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              يرجى ملء البيانات بدقة. العلامة <span className="text-red-600 font-bold">*</span> تشير إلى سؤال إجباري.
            </p>
          </div>

          <div className="text-left">
            <span className="text-xs text-stone-500 block">الخطوة الحالية</span>
            <span className="text-lg font-extrabold text-emerald-800">
              {stepIndex + 1} من {activeSections.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1">
          {activeSections.map((sec, idx) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                if (idx <= stepIndex) setStepIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                idx === stepIndex
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : idx < stepIndex
                  ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              {idx + 1}. {sec.title}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 space-y-6">
        {currentSection?.id === 'sec3_router' && (
          <div className="space-y-4">
            <QuestionBlock number="1" title="أنت:" required>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {['عريس (ذكر)', 'عروسة (أنثى)'].map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => updateField('q1_gender', choice)}
                    className={`p-5 rounded-2xl border-2 text-right transition flex items-center justify-between ${
                      form.q1_gender === choice
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-extrabold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700 font-semibold'
                    }`}
                  >
                    <span className="text-base">{choice}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        form.q1_gender === choice ? 'border-emerald-700 bg-emerald-700' : 'border-stone-300'
                      }`}
                    >
                      {form.q1_gender === choice && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_male_edu' && (
          <QuestionBlock number="2" title="المستوى التعليمي" required>
            <RadioGroup
              options={[
                'غير متعلم',
                'إبتدائي',
                'إعدادي',
                'ثانوي عام',
                'ثانوي أزهر',
                'مؤهل متوسط (دبلوم)',
                'معهد',
                'مؤهل جامعي (عالي)'
              ]}
              value={form.q2_maleEduLevel}
              onChange={(val) => updateField('q2_maleEduLevel', val)}
            />
          </QuestionBlock>
        )}

        {currentSection?.id === 'sec_male_uni' && (
          <div className="space-y-5">
            <QuestionBlock number="3" title="نوع الدرجة العلمية" required>
              <SelectDropdown
                options={DEGREE_TYPES}
                value={form.q3_maleDegreeType}
                onChange={(val) => updateField('q3_maleDegreeType', val)}
                placeholder="اختر نوع الدرجة العلمية"
              />
            </QuestionBlock>

            <QuestionBlock number="4" title="اسم الجامعة" required>
              <SelectDropdown
                options={UNIVERSITIES}
                value={form.q4_maleUniversity}
                onChange={(val) => updateField('q4_maleUniversity', val)}
                placeholder="اختر اسم الجامعة"
              />
            </QuestionBlock>

            <QuestionBlock number="5" title="اسم الكلية / التخصص" required>
              <SelectDropdown
                options={FACULTIES}
                value={form.q5_maleFaculty}
                onChange={(val) => updateField('q5_maleFaculty', val)}
                placeholder="اختر اسم الكلية / التخصص"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_male_basic' && (
          <div className="space-y-6">
            <QuestionBlock number="6" title="ما هي حالتك الاجتماعية؟" required>
              <RadioGroup
                options={['أعزب', 'متزوج', 'منفصل بدون طلاق', 'مطلق', 'أرمل']}
                value={form.q6_maleMaritalStatus}
                onChange={(val) => updateField('q6_maleMaritalStatus', val)}
              />
            </QuestionBlock>

            <SectionBanner title="أولاً: المواصفات العامة" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuestionBlock number="7" title="تاريخ الميلاد">
                <input
                  type="date"
                  value={form.q7_maleBirthDate}
                  onChange={(e) => updateField('q7_maleBirthDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="8" title="الوزن">
                <input
                  type="text"
                  value={form.q8_maleWeight}
                  onChange={(e) => updateField('q8_maleWeight', e.target.value)}
                  placeholder="مثال: 78 كجم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="9" title="الطول">
                <input
                  type="text"
                  value={form.q9_maleHeight}
                  onChange={(e) => updateField('q9_maleHeight', e.target.value)}
                  placeholder="مثال: 176 سم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>
            </div>

            <QuestionBlock number="10" title="لون البشرة">
              <RadioGroup
                options={['أبيض', 'أشقر', 'فاتح', 'خمري', 'قمحي', 'قمحي غامق', 'أسمر']}
                value={form.q10_maleSkinColor}
                onChange={(val) => updateField('q10_maleSkinColor', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="11" title="هل تهتم بمظهرك ونظافتك ؟">
              <RadioGroup
                options={[
                  'أحرص عليها دائمًا',
                  'أحرص عليها في الحدود المعقولة',
                  'أحتاج إلى تطوير هذا الجانب'
                ]}
                value={form.q11_maleHygiene}
                onChange={(val) => updateField('q11_maleHygiene', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="12" title="اللحية">
              <RadioGroup
                options={[
                  'تارك اللحية سنة',
                  'لحية خفيفة تأخذ منها',
                  'لحية علي الموضة',
                  'أملس',
                  'حالق اللحية'
                ]}
                value={form.q12_maleBeard}
                onChange={(val) => updateField('q12_maleBeard', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="13" title="هل أنت رياضي ؟">
              <RadioGroup
                options={['نعم', 'لا', 'إلى حد ما']}
                value={form.q13_maleSport}
                onChange={(val) => updateField('q13_maleSport', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="14" title="هل تعاني من أي أمراض؟">
              <input
                type="text"
                value={form.q14_maleDiseases}
                onChange={(e) => updateField('q14_maleDiseases', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="15" title="هل عندكِ رغبة في الإنجاب؟">
              <RadioGroup
                options={['نعم', 'لا', 'حسب الاتفاق']}
                value={form.q15_maleKidsGoal}
                onChange={(val) => updateField('q15_maleKidsGoal', val)}
              />
            </QuestionBlock>

            <SectionBanner title="ثانياً: العمل" />

            <QuestionBlock number="16" title="العمل الفعلي">
              <input
                type="text"
                value={form.q16_maleActualJob}
                onChange={(e) => updateField('q16_maleActualJob', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="17" title="نوع العمل (يمكن اختيار أكثر من خيار)">
              <CheckboxGroup
                options={['حكومي', 'خاص', 'صاحب عمل']}
                values={form.q17_maleJobType}
                onToggle={(val) => toggleCheckboxArray('q17_maleJobType', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="18" title="هل لديك ملحوظات بخصوص العمل ؟">
              <input
                type="text"
                value={form.q18_maleJobNotes}
                onChange={(e) => updateField('q18_maleJobNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="19" title="مستوى الدخل">
              <RadioGroup
                options={['عادي', 'متوسط', 'ميسور', 'عالي']}
                value={form.q19_maleIncome}
                onChange={(val) => updateField('q19_maleIncome', val)}
              />
            </QuestionBlock>

            <SectionBanner title="ثالثاً: الوضع الاجتماعي" />

            <QuestionBlock number="20" title="هل سبق لك الخطوبة أو عقد زواج؟">
              <input
                type="text"
                value={form.q20_malePrevEngaged}
                onChange={(e) => updateField('q20_malePrevEngaged', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="21" title="هل ترغب في التعدد؟">
              <RadioGroup
                options={['نعم', 'لا', 'لم أحدد بعد']}
                value={form.q21_malePolygamyDesire}
                onChange={(val) => updateField('q21_malePolygamyDesire', val)}
              />
            </QuestionBlock>

            <SectionBanner title="رابعاً: بيانات الأسرة" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuestionBlock number="22" title="عمل الوالد">
                <input
                  type="text"
                  value={form.q22_maleFatherJob}
                  onChange={(e) => updateField('q22_maleFatherJob', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="23" title="عمل الوالدة">
                <input
                  type="text"
                  value={form.q23_maleMotherJob}
                  onChange={(e) => updateField('q23_maleMotherJob', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="24" title="عدد الأخوة">
                <input
                  type="text"
                  value={form.q24_maleBrothersCount}
                  onChange={(e) => updateField('q24_maleBrothersCount', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="25" title="عدد الاخوات">
                <input
                  type="text"
                  value={form.q25_maleSistersCount}
                  onChange={(e) => updateField('q25_maleSistersCount', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>
            </div>

            <QuestionBlock number="26" title="مستوي تعليم الأخوة">
              <input
                type="text"
                value={form.q26_maleSiblingsEdu}
                onChange={(e) => updateField('q26_maleSiblingsEdu', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <SectionBanner title="خامساً: بيانات السكن" />

            <QuestionBlock number="27" title="المحافظة التي ولدت بها">
              <SelectDropdown
                options={GOVERNORATES}
                value={form.q27_maleBirthGov}
                onChange={(val) => updateField('q27_maleBirthGov', val)}
                placeholder="اختر المحافظة"
              />
            </QuestionBlock>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuestionBlock number="28" title="مكان السكن والإقامة الحالي">
                <input
                  type="text"
                  value={form.q28_maleCurrentResidence}
                  onChange={(e) => updateField('q28_maleCurrentResidence', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="29" title="اسم المنطقة">
                <input
                  type="text"
                  value={form.q29_maleDistrictName}
                  onChange={(e) => updateField('q29_maleDistrictName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>
            </div>

            <QuestionBlock number="30" title="شكل المنطقة">
              <RadioGroup
                options={['شعبي', 'متوسط', 'راقي']}
                value={form.q30_maleDistrictType}
                onChange={(val) => updateField('q30_maleDistrictType', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="31" title="أين سكن الزوجية ؟">
              <input
                type="text"
                value={form.q31_maleMaritalHome}
                onChange={(e) => updateField('q31_maleMaritalHome', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="32" title="نظام السكن">
              <RadioGroup
                options={[
                  'إيجار مدة',
                  'إيجار مفتوح',
                  'تمليك منفصل',
                  'تمليك بيت عيلة حياة منفصلة',
                  'تمليك بيت عيلة حياة اجتماعية',
                  'حسب الاتفاق مع الزوجة إن كانت حياة منفصلة أم اجتماعية'
                ]}
                value={form.q32_maleHousingSystem}
                onChange={(val) => updateField('q32_maleHousingSystem', val)}
              />
            </QuestionBlock>

            <SectionBanner title="سادساً: بيانات التدين والالتزام" />

            <QuestionBlock number="33" title="مستوى التدين">
              <RadioGroup
                options={['متدين', 'متوسط التدين', 'تدين ضعيف']}
                value={form.q33_maleReligiosity}
                onChange={(val) => updateField('q33_maleReligiosity', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="34" title="المحافظة علي الصلوات">
              <RadioGroup
                options={[
                  'كل الصلوات في المسجد',
                  'معظم الصلوات في المسجد',
                  'كل الصلوات في البيت',
                  'صلاة متقطعة',
                  'لا يصلي'
                ]}
                value={form.q34_malePrayer}
                onChange={(val) => updateField('q34_malePrayer', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="35" title="مدخن أم لا ؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q35_maleSmoking}
                onChange={(val) => updateField('q35_maleSmoking', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="36" title="مقدار الحفظ من القرآن ؟">
              <input
                type="text"
                value={form.q36_maleQuran}
                onChange={(e) => updateField('q36_maleQuran', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="37" title="هل تشاهد الأفلام والمسلسلات؟">
              <RadioGroup
                options={['نعم', 'لا', 'أحيانًا']}
                value={form.q37_maleMovies}
                onChange={(val) => updateField('q37_maleMovies', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="38" title="هل تستمع للأغاني؟">
              <RadioGroup
                options={['نعم', 'لا', 'أحيانًا']}
                value={form.q38_maleSongs}
                onChange={(val) => updateField('q38_maleSongs', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="39" title="من من الدعاة والعلماء تسمع لهم خطب ودروس ومحاضرات ؟">
              <input
                type="text"
                value={form.q39_malePreachers}
                onChange={(e) => updateField('q39_malePreachers', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="40" title="هل درست علم شرعي من قبل أو لديك النية ؟">
              <input
                type="text"
                value={form.q40_maleIslamicStudy}
                onChange={(e) => updateField('q40_maleIslamicStudy', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <SectionBanner title="سابعاً: بيانات اخرى" />

            <QuestionBlock number="41" title="تكلم عن نفسك أو ما يقوله الناس عنك ؟">
              <textarea
                rows={3}
                value={form.q41_maleAboutSelf}
                onChange={(e) => updateField('q41_maleAboutSelf', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="42" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <textarea
                rows={2}
                value={form.q42_maleBasicNotes}
                onChange={(e) => updateField('q42_maleBasicNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_male_poly' && (
          <div className="space-y-5">
            <QuestionBlock number="43" title="عدد مرات الزواج ؟">
              <input
                type="text"
                value={form.q43_maleMarriagesCount}
                onChange={(e) => updateField('q43_maleMarriagesCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="44" title="كم زوجة علي ذمتك ؟">
              <input
                type="text"
                value={form.q44_maleCurrentWivesCount}
                onChange={(e) => updateField('q44_maleCurrentWivesCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="45" title="هل الزواج بعلم الزوجة الأولى ؟">
              <RadioGroup
                options={['نعم (بعلمها)', 'لا (بدون علمها)', 'سأخبرها لاحقاً']}
                value={form.q45_maleFirstWifeKnows}
                onChange={(val) => updateField('q45_maleFirstWifeKnows', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="46" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <textarea
                rows={3}
                value={form.q46_malePolyNotes}
                onChange={(e) => updateField('q46_malePolyNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_male_divorced' && (
          <div className="space-y-5">
            <QuestionBlock number="47" title="صورة قسيمة الطلاق">
              <FileUploadBox
                value={form.q47_maleDivorceCert}
                onChange={(val) => updateField('q47_maleDivorceCert', val)}
                label="ارفع صورة قسيمة الطلاق أو اكتب اسم الملف"
              />
            </QuestionBlock>

            <QuestionBlock number="48" title="عدد مرات الزواج؟">
              <input
                type="text"
                value={form.q48_maleMarriagesCount}
                onChange={(e) => updateField('q48_maleMarriagesCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="49" title="هل يوجد اولاد وكم عددهم؟">
              <input
                type="text"
                value={form.q49_maleHasKidsCount}
                onChange={(e) => updateField('q49_maleHasKidsCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="50" title="كم أعمارهم ؟ وحضانتهم مع مين إذا وجد:">
              <input
                type="text"
                value={form.q50_maleKidsAgesCustody}
                onChange={(e) => updateField('q50_maleKidsAgesCustody', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="51" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <textarea
                rows={3}
                value={form.q51_maleDivorcedNotes}
                onChange={(e) => updateField('q51_maleDivorcedNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_male_widower' && (
          <div className="space-y-5">
            <QuestionBlock number="52" title="صورة شهادة الوفاة">
              <FileUploadBox
                value={form.q52_maleDeathCert}
                onChange={(val) => updateField('q52_maleDeathCert', val)}
                label="ارفع صورة شهادة الوفاة أو اكتب اسم الملف"
              />
            </QuestionBlock>

            <QuestionBlock number="53" title="عدد مرات الزواج ؟">
              <input
                type="text"
                value={form.q53_maleMarriagesCount}
                onChange={(e) => updateField('q53_maleMarriagesCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="54" title="هل يوجد اولاد وكم عددهم؟">
              <input
                type="text"
                value={form.q54_maleHasKidsCount}
                onChange={(e) => updateField('q54_maleHasKidsCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="55" title="كم أعمارهم ؟ وحضانتهم مع مين إذا وجد:">
              <input
                type="text"
                value={form.q55_maleKidsAgesCustody}
                onChange={(e) => updateField('q55_maleKidsAgesCustody', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="56" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <textarea
                rows={3}
                value={form.q56_maleWidowerNotes}
                onChange={(e) => updateField('q56_maleWidowerNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_male_partner' && (
          <div className="space-y-5">
            <QuestionBlock number="63" title="المواصفات المطلوبة">
              <textarea
                rows={3}
                value={form.q63_malePartnerSpecs}
                onChange={(e) => updateField('q63_malePartnerSpecs', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuestionBlock number="64" title="السن المناسب؟">
                <input
                  type="text"
                  value={form.q64_malePartnerAge}
                  onChange={(e) => updateField('q64_malePartnerAge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="65" title="لون البشرة؟">
                <input
                  type="text"
                  value={form.q65_malePartnerSkin}
                  onChange={(e) => updateField('q65_malePartnerSkin', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>
            </div>

            <QuestionBlock number="66" title="الحالة الاجتماعية (يمكن اختيار أكثر من خيار)">
              <CheckboxGroup
                options={['آنسة', 'مطلقة', 'أرملة']}
                values={form.q66_malePartnerStatus}
                onToggle={(val) => toggleCheckboxArray('q66_malePartnerStatus', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="67" title="هل توافق بمطلقة أطفالها في حضانة والدهم ؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q67_maleAcceptDivorcedDadCustody}
                onChange={(val) => updateField('q67_maleAcceptDivorcedDadCustody', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="68" title="هل توافق بمطلقة أو أرملة معها أطفال؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q68_maleAcceptWithKids}
                onChange={(val) => updateField('q68_maleAcceptWithKids', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="69" title="هل تقبل الزواج من محافظة أخرى (اذكر المحافظة)؟">
              <input
                type="text"
                value={form.q69_maleAcceptOtherGov}
                onChange={(e) => updateField('q69_maleAcceptOtherGov', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="70" title="ماذا تفضل حجاب أم نقاب أم كلاهما؟">
              <RadioGroup
                options={['حجاب', 'نقاب', 'كلاهما']}
                value={form.q70_malePartnerHijabPref}
                onChange={(val) => updateField('q70_malePartnerHijabPref', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="71" title="المؤهل">
              <RadioGroup
                options={['عالي', 'متوسط', 'كلاهما']}
                value={form.q71_malePartnerEduPref}
                onChange={(val) => updateField('q71_malePartnerEduPref', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="72" title="العمل">
              <RadioGroup
                options={['تعمل', 'لا تعمل', 'حسب الإتفاق']}
                value={form.q72_malePartnerWorkPref}
                onChange={(val) => updateField('q72_malePartnerWorkPref', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="73" title="هل تريد الزواج بقائمة منقولات أم بدون">
              <RadioGroup
                options={[
                  'بدون قائمة منقولات (العريس يجهز شقته بالكامل)',
                  'قائمة منقولات',
                  'لا مانع (موافق علي أي منهما)'
                ]}
                value={form.q73_maleQaymaPref}
                onChange={(val) => updateField('q73_maleQaymaPref', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="74" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <input
                type="text"
                value={form.q74_malePartnerNotes}
                onChange={(e) => updateField('q74_malePartnerNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_male_sender' && (
          <QuestionBlock number="57" title="من مرسل الاستمارة">
            <RadioGroup
              options={['أنت (العريس)', 'أحد الاقارب']}
              value={form.q57_maleSender}
              onChange={(val) => updateField('q57_maleSender', val)}
            />
          </QuestionBlock>
        )}

        {currentSection?.id === 'sec_male_relative' && (
          <div className="space-y-5">
            <QuestionBlock number="58" title="ما صلة القرابة ؟">
              <RadioGroup
                options={['والد العريس', 'والدة العريس', 'أخ العريس', 'أخت العريس']}
                value={form.q58_maleRelativeType}
                onChange={(val) => updateField('q58_maleRelativeType', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="59" title="هل ملء الاستمارة تم بعلم العريس ؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q59_maleWithGroomKnowledge}
                onChange={(val) => updateField('q59_maleWithGroomKnowledge', val)}
              />
            </QuestionBlock>

            <QuestionBlock
              number="60"
              title="صورة بطاقة سارية لمرسل الإستمارة مع إخفاء الرقم القومي وإظهار أول 6 أرقام من اليسار (الوجه الأمامي)"
            >
              <IdSampleIllustration side="front" />
              <FileUploadBox
                value={form.q60_maleRelativeIdFront}
                onChange={(val) => updateField('q60_maleRelativeIdFront', val)}
                label="ارفع صورة الوجه الأمامي لبطاقة المرسل (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock
              number="61"
              title="صورة بطاقة سارية لمرسل الإستمارة مع إخفاء الرقم القومي وإظهار أول 6 أرقام من اليسار (الوجه الخلفي)"
            >
              <IdSampleIllustration side="back" />
              <FileUploadBox
                value={form.q61_maleRelativeIdBack}
                onChange={(val) => updateField('q61_maleRelativeIdBack', val)}
                label="ارفع صورة الوجه الخلفي لبطاقة المرسل (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock number="62" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <input
                type="text"
                value={form.q62_maleRelativeNotes}
                onChange={(e) => updateField('q62_maleRelativeNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_male_conclusion' && (
          <div className="space-y-5">
            <QuestionBlock
              number="141"
              title="صورة بطاقة سارية للعريس الإستمارة مع إخفاء الرقم القومي وإظهار أول 6 أرقام من اليسار (الوجه الأمامي)"
            >
              <IdSampleIllustration side="front" />
              <FileUploadBox
                value={form.q141_maleIdFront}
                onChange={(val) => updateField('q141_maleIdFront', val)}
                label="ارفع صورة البطاقة الأمامية للعريس (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock
              number="142"
              title="صورة بطاقة سارية للعريس الإستمارة مع إخفاء الرقم القومي وإظهار أول 6 أرقام من اليسار (الوجه الخلفي)"
            >
              <IdSampleIllustration side="back" />
              <FileUploadBox
                value={form.q142_maleIdBack}
                onChange={(val) => updateField('q142_maleIdBack', val)}
                label="ارفع صورة البطاقة الخلفية للعريس (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock
              number="143"
              title="رقم الهاتف (من البيانات السرية التي لا تظهر في الاستمارة)"
            >
              <input
                type="tel"
                value={form.q143_maleSecretPhone}
                onChange={(e) => updateField('q143_maleSecretPhone', e.target.value)}
                placeholder="مثال: 01012345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/40 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock
              number="144"
              title="رابط حسابك علي الفيسبوك اللي بتكلمنا منه (من البيانات السرية التي لا تظهر في الاستمارة)"
            >
              <input
                type="url"
                value={form.q144_maleSecretFb}
                onChange={(e) => updateField('q144_maleSecretFb', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/40 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="145" title="صورة شخصية واضحة وحديثة">
              <FileUploadBox
                value={form.q145_malePersonalPhoto}
                onChange={(val) => updateField('q145_malePersonalPhoto', val)}
                label="ارفع صورة شخصية واضحة وحديثة (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock
              number="146"
              title="هل توافق على نشر استمارتك على صفحتنا بالفيسبوك؟"
              required
            >
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q146_malePublishFb}
                onChange={(val) => updateField('q146_malePublishFb', val)}
              />
            </QuestionBlock>

            <QuestionBlock
              number="147"
              title="هل توافق على نشر استمارتك على قناتنا بالتليجرام؟"
              required
            >
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q147_malePublishTelegram}
                onChange={(val) => updateField('q147_malePublishTelegram', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="148" title="هل سبق لك مراسلتنا من حساب آخر؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q148_malePrevContact}
                onChange={(val) => updateField('q148_malePrevContact', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="149" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <textarea
                rows={2}
                value={form.q149_maleFinalNotes}
                onChange={(e) => updateField('q149_maleFinalNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="150" title="إقرار وتعهد" required>
              <label className="flex items-start gap-3 p-4 rounded-2xl border-2 border-emerald-700 bg-emerald-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.q150_malePledge}
                  onChange={(e) => updateField('q150_malePledge', e.target.checked)}
                  className="mt-1 w-5 h-5 accent-emerald-800 shrink-0"
                />
                <span className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed">
                  أشهد الله أن جميع البيانات المذكورة في هذه الاستمارة صحيحة وحقيقية، وأتحمل المسؤولية الكاملة أمام الله ثم أمام إدارة الصفحة في حال وجود أي بيانات غير صحيحة.
                </span>
              </label>
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_female_edu' && (
          <QuestionBlock number="75" title="المستوى التعليمي" required>
            <RadioGroup
              options={[
                'غير متعلمة',
                'إبتدائية',
                'إعدادية',
                'ثانوية عامة',
                'مؤهل متوسط (دبلوم)',
                'معهد',
                'مؤهل جامعي (عالي)'
              ]}
              value={form.q75_femaleEduLevel}
              onChange={(val) => updateField('q75_femaleEduLevel', val)}
            />
          </QuestionBlock>
        )}

        {currentSection?.id === 'sec_female_uni' && (
          <div className="space-y-5">
            <QuestionBlock number="76" title="نوع الدرجة العلمية" required>
              <SelectDropdown
                options={DEGREE_TYPES}
                value={form.q76_femaleDegreeType}
                onChange={(val) => updateField('q76_femaleDegreeType', val)}
                placeholder="اختر نوع الدرجة العلمية"
              />
            </QuestionBlock>

            <QuestionBlock number="77" title="اسم الجامعة" required>
              <SelectDropdown
                options={UNIVERSITIES}
                value={form.q77_femaleUniversity}
                onChange={(val) => updateField('q77_femaleUniversity', val)}
                placeholder="اختر اسم الجامعة"
              />
            </QuestionBlock>

            <QuestionBlock number="78" title="اسم الكلية / التخصص" required>
              <SelectDropdown
                options={FACULTIES}
                value={form.q78_femaleFaculty}
                onChange={(val) => updateField('q78_femaleFaculty', val)}
                placeholder="اختر اسم الكلية / التخصص"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_female_basic' && (
          <div className="space-y-6">
            <QuestionBlock number="79" title="ما هي حالتك الإجتماعية ؟" required>
              <RadioGroup
                options={['عزباء (بكر)', 'مطلقة', 'أرملة']}
                value={form.q79_femaleMaritalStatus}
                onChange={(val) => updateField('q79_femaleMaritalStatus', val)}
              />
            </QuestionBlock>

            <SectionBanner title="أولاً: المواصفات العامة (عام)" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuestionBlock number="80" title="تاريخ الميلاد">
                <input
                  type="date"
                  value={form.q80_femaleBirthDate}
                  onChange={(e) => updateField('q80_femaleBirthDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="81" title="الوزن:">
                <input
                  type="text"
                  value={form.q81_femaleWeight}
                  onChange={(e) => updateField('q81_femaleWeight', e.target.value)}
                  placeholder="مثال: 60 كجم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="82" title="الطول:">
                <input
                  type="text"
                  value={form.q82_femaleHeight}
                  onChange={(e) => updateField('q82_femaleHeight', e.target.value)}
                  placeholder="مثال: 164 سم"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>
            </div>

            <QuestionBlock number="83" title="لون البشرة:">
              <RadioGroup
                options={[
                  'ناصعة البياض',
                  'بيضاء',
                  'شقراء',
                  'فاتح',
                  'خمري',
                  'قمحي',
                  'قمحي غامق',
                  'سمراء'
                ]}
                value={form.q83_femaleSkinColor}
                onChange={(val) => updateField('q83_femaleSkinColor', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="84" title="هل تهتم بمظهرك ونظافتك ؟">
              <RadioGroup
                options={[
                  'أحرص عليها دائمًا',
                  'أحرص عليها في الحدود المعقولة',
                  'أحتاج إلى تطوير هذا الجانب'
                ]}
                value={form.q84_femaleHygiene}
                onChange={(val) => updateField('q84_femaleHygiene', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="85" title="درجة الجمال؟">
              <RadioGroup
                options={['متوسط', 'جيد', 'جيد جدًا', 'ممتاز']}
                value={form.q85_femaleBeauty}
                onChange={(val) => updateField('q85_femaleBeauty', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="86" title="هل تعانين من أي أمراض أو إعاقات؟">
              <textarea
                rows={2}
                value={form.q86_femaleDiseases}
                onChange={(e) => updateField('q86_femaleDiseases', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <SectionBanner title="ثانيا: بيانات السكن" />

            <QuestionBlock number="87" title="المحافظة التي ولدت بها">
              <SelectDropdown
                options={GOVERNORATES}
                value={form.q87_femaleBirthGov}
                onChange={(val) => updateField('q87_femaleBirthGov', val)}
                placeholder="اختر المحافظة"
              />
            </QuestionBlock>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuestionBlock number="88" title="مكان السكن والإقامة الحالي">
                <input
                  type="text"
                  value={form.q88_femaleCurrentResidence}
                  onChange={(e) => updateField('q88_femaleCurrentResidence', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="89" title="اسم المنطقة">
                <input
                  type="text"
                  value={form.q89_femaleDistrictName}
                  onChange={(e) => updateField('q89_femaleDistrictName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>
            </div>

            <QuestionBlock number="90" title="شكل المنطقة">
              <RadioGroup
                options={['شعبي', 'متوسط', 'راقي']}
                value={form.q90_femaleDistrictType}
                onChange={(val) => updateField('q90_femaleDistrictType', val)}
              />
            </QuestionBlock>

            <SectionBanner title="ثالثا: العمل" />

            <QuestionBlock number="91" title="العمل الفعلي:">
              <input
                type="text"
                value={form.q91_femaleActualJob}
                onChange={(e) => updateField('q91_femaleActualJob', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="92" title="نوع العمل:">
              <RadioGroup
                options={['حكومي', 'خاص', 'صاحبة عمل', 'لا أعمل حاليًا', 'ربة منزل']}
                value={form.q92_femaleJobType}
                onChange={(val) => updateField('q92_femaleJobType', val)}
              />
            </QuestionBlock>

            <SectionBanner title="رابعا: وضع الحالة الاجتماعية" />

            <QuestionBlock number="93" title="هل سبق لكِ الارتباط (خطوبة أو عقد زواج)؟">
              <input
                type="text"
                value={form.q93_femalePrevEngaged}
                onChange={(e) => updateField('q93_femalePrevEngaged', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="94" title="هل تقدرين ان تكوني زوجة لرجل متزوج ؟">
              <RadioGroup
                options={['نعم اقدر', 'لا اقدر', 'على حسب ظروفه']}
                value={form.q94_femaleAcceptMarriedMan}
                onChange={(val) => updateField('q94_femaleAcceptMarriedMan', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="95" title="هل عندكِ رغبة في الإنجاب؟">
              <RadioGroup
                options={['نعم', 'لا', 'حسب الاتفاق']}
                value={form.q95_femaleKidsGoal}
                onChange={(val) => updateField('q95_femaleKidsGoal', val)}
              />
            </QuestionBlock>

            <SectionBanner title="سادساً: بيانات التدين والالتزام" />

            <QuestionBlock number="96" title="مستوى التدين">
              <RadioGroup
                options={['متدينة', 'متوسطة التدين', 'تدين ضعيف']}
                value={form.q96_femaleReligiosity}
                onChange={(val) => updateField('q96_femaleReligiosity', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="97" title="المحافظة علي الصلوات">
              <RadioGroup
                options={[
                  'أصلي جميع الفروض في وقتها',
                  'أصلي ولكن أؤخر بعض الصلوات',
                  'صلاة متقطعة',
                  'لا أصلي'
                ]}
                value={form.q97_femalePrayer}
                onChange={(val) => updateField('q97_femalePrayer', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="98" title="مقدار الحفظ من القرآن ؟">
              <input
                type="text"
                value={form.q98_femaleQuran}
                onChange={(e) => updateField('q98_femaleQuran', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="99" title="هل تشاهدين الأفلام والمسلسلات؟">
              <RadioGroup
                options={['نعم', 'لا', 'أحيانًا']}
                value={form.q99_femaleMovies}
                onChange={(val) => updateField('q99_femaleMovies', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="100" title="هل تستمعين للأغاني؟">
              <RadioGroup
                options={['نعم', 'لا', 'أحيانًا']}
                value={form.q100_femaleSongs}
                onChange={(val) => updateField('q100_femaleSongs', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="101" title="من من الدعاة والعلماء تسمعين لهم خطب ودروس ومحاضرات ؟">
              <input
                type="text"
                value={form.q101_femalePreachers}
                onChange={(e) => updateField('q101_femalePreachers', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="102" title="هل درستِ علم شرعي من قبل أو لديكِ النية ؟">
              <input
                type="text"
                value={form.q102_femaleIslamicStudy}
                onChange={(e) => updateField('q102_femaleIslamicStudy', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="103" title="ما نوع الحجاب؟">
              <RadioGroup
                options={[
                  'نقاب أسود',
                  'نقاب ألوان',
                  'خمار إسلامي',
                  'طرح وفساتين',
                  'جيب وبناطيل'
                ]}
                value={form.q103_femaleHijabType}
                onChange={(val) => updateField('q103_femaleHijabType', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="104" title="هل يوجد استعداد للنقاب؟">
              <RadioGroup
                options={['نعم', 'لا', 'منتقبة بالفعل']}
                value={form.q104_femaleNiqabReady}
                onChange={(val) => updateField('q104_femaleNiqabReady', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="105" title="تكلمي عن نفسكِ أو ما يقوله الناس عنكِ ؟">
              <textarea
                rows={3}
                value={form.q105_femaleAboutSelf}
                onChange={(e) => updateField('q105_femaleAboutSelf', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="106" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <input
                type="text"
                value={form.q106_femaleGeneralNotes}
                onChange={(e) => updateField('q106_femaleGeneralNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <SectionBanner title="سابعا البيانات الخاصة بشريك الحياة (المواصفات المطلوبة)" />

            <QuestionBlock number="107" title="المواصفات العامة المطلوبة:">
              <textarea
                rows={3}
                value={form.q107_femalePartnerSpecs}
                onChange={(e) => updateField('q107_femalePartnerSpecs', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuestionBlock number="108" title="السن المناسب لكِ:">
                <input
                  type="text"
                  value={form.q108_femalePartnerAge}
                  onChange={(e) => updateField('q108_femalePartnerAge', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>

              <QuestionBlock number="110" title="لون البشرة المطلوب:">
                <input
                  type="text"
                  value={form.q110_femalePartnerSkin}
                  onChange={(e) => updateField('q110_femalePartnerSkin', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </QuestionBlock>
            </div>

            <QuestionBlock number="109" title="المؤهل المطلوب:">
              <RadioGroup
                options={['عالي', 'متوسط', 'كلاهما']}
                value={form.q109_femalePartnerEdu}
                onChange={(val) => updateField('q109_femalePartnerEdu', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="111" title="الحالة الاجتماعية للعريس (يمكنكِ اختيار أكثر من خيار):">
              <CheckboxGroup
                options={['أعزب', 'متزوج', 'مطلق', 'أرمل']}
                values={form.q111_femalePartnerStatus}
                onToggle={(val) => toggleCheckboxArray('q111_femalePartnerStatus', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="112" title="هل تقبلين بمطلق أو أرمل (بدون أطفال نهائياً)؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q112_femaleAcceptNoKids}
                onChange={(val) => updateField('q112_femaleAcceptNoKids', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="113" title="هل تقبلين بمطلق أو أرمل (معه أطفال في حضانته هو)؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q113_femaleAcceptHisCustody}
                onChange={(val) => updateField('q113_femaleAcceptHisCustody', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="114" title="هل تقبلين بمطلق (أطفاله في حضانة والدتهم)؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q114_femaleAcceptMomCustody}
                onChange={(val) => updateField('q114_femaleAcceptMomCustody', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="115" title="هل تقبلين من محافظة أخرى؟ (اذكري المحافظة المقبولة)">
              <input
                type="text"
                value={form.q115_femaleAcceptOtherGov}
                onChange={(e) => updateField('q115_femaleAcceptOtherGov', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="116" title="هل لديكِ شروط خاصة بـ (اللحية - التدخين - السكن)؟">
              <textarea
                rows={2}
                value={form.q116_femaleSpecialConditions}
                onChange={(e) => updateField('q116_femaleSpecialConditions', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="117" title="هل توافقين والأهل على الزواج بـ">
              <RadioGroup
                options={[
                  'بدون قائمة منقولات (بالمهر والفرش الكامل من العريس)',
                  'قائمة منقولات (مشاركة في الفرش)',
                  'لا مانع (موافقون على أي منهما)'
                ]}
                value={form.q117_femaleQaymaPref}
                onChange={(val) => updateField('q117_femaleQaymaPref', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="118" title="هل لديكِ أي ملاحظة أو شروط خاصة بخصوص القائمة والمهر؟">
              <textarea
                rows={2}
                value={form.q118_femaleQaymaNotes}
                onChange={(e) => updateField('q118_femaleQaymaNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_female_divorced' && (
          <div className="space-y-5">
            <QuestionBlock number="125" title="كم عامًا مضى علي وقوع الطلاق ؟" required>
              <input
                type="text"
                value={form.q125_femaleYearsSinceDivorce}
                onChange={(e) => updateField('q125_femaleYearsSinceDivorce', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="126" title="صورة قسيمة الطلاق">
              <FileUploadBox
                value={form.q126_femaleDivorceCert}
                onChange={(val) => updateField('q126_femaleDivorceCert', val)}
                label="ارفع صورة قسيمة الطلاق (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock number="127" title="عدد مرات الزواج؟">
              <input
                type="text"
                value={form.q127_femaleMarriagesCount}
                onChange={(e) => updateField('q127_femaleMarriagesCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="128" title="هل يوجد اولاد وكم عددهم؟">
              <input
                type="text"
                value={form.q128_femaleHasKidsCount}
                onChange={(e) => updateField('q128_femaleHasKidsCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="129" title="كم أعمارهم ؟ وحضانتهم مع مين إذا وجد:">
              <input
                type="text"
                value={form.q129_femaleKidsAgesCustody}
                onChange={(e) => updateField('q129_femaleKidsAgesCustody', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="130" title="ومن سينفق عليهم بعد زواجك ؟">
              <input
                type="text"
                value={form.q130_femaleKidsFinancialSupport}
                onChange={(e) => updateField('q130_femaleKidsFinancialSupport', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="131" title="هل تم انتهاء العدة بعد الطلاق ؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q131_femaleEddaCompleted}
                onChange={(val) => updateField('q131_femaleEddaCompleted', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="132" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <input
                type="text"
                value={form.q132_femaleDivorcedNotes}
                onChange={(e) => updateField('q132_femaleDivorcedNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_female_widow' && (
          <div className="space-y-5">
            <QuestionBlock number="133" title="كم عام مضى على وفاة زوجك؟">
              <input
                type="text"
                value={form.q133_femaleYearsSinceDeath}
                onChange={(e) => updateField('q133_femaleYearsSinceDeath', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="134" title="صورة شهادة الوفاة">
              <FileUploadBox
                value={form.q134_femaleDeathCert}
                onChange={(val) => updateField('q134_femaleDeathCert', val)}
                label="ارفع صورة شهادة الوفاة (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock number="135" title="عدد مرات الزواج؟">
              <input
                type="text"
                value={form.q135_femaleMarriagesCount}
                onChange={(e) => updateField('q135_femaleMarriagesCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="136" title="هل يوجد اولاد وكم عددهم؟">
              <input
                type="text"
                value={form.q136_femaleHasKidsCount}
                onChange={(e) => updateField('q136_femaleHasKidsCount', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="137" title="كم أعمارهم ؟ وحضانتهم مع مين إذا وجد:">
              <input
                type="text"
                value={form.q137_femaleKidsAgesCustody}
                onChange={(e) => updateField('q137_femaleKidsAgesCustody', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="138" title="ومن سينفق عليهم بعد زواجك ؟">
              <input
                type="text"
                value={form.q138_femaleKidsFinancialSupport}
                onChange={(e) => updateField('q138_femaleKidsFinancialSupport', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="139" title="هل تم انتهاء العدة بعد الوفاة ؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q139_femaleEddaCompleted}
                onChange={(val) => updateField('q139_femaleEddaCompleted', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="140" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <input
                type="text"
                value={form.q140_femaleWidowNotes}
                onChange={(e) => updateField('q140_femaleWidowNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_female_sender' && (
          <QuestionBlock number="119" title="من الذي قام بملء هذه الاستمارة؟" required>
            <RadioGroup
              options={['أنتِ (العروسة)', 'أحد الأقارب']}
              value={form.q119_femaleSender}
              onChange={(val) => updateField('q119_femaleSender', val)}
            />
          </QuestionBlock>
        )}

        {currentSection?.id === 'sec_female_relative' && (
          <div className="space-y-5">
            <QuestionBlock number="120" title="ما صلة القرابة ؟" required>
              <RadioGroup
                options={['والد العروسة', 'والدة العروسة', 'أخ العروسة', 'أخت العروسة']}
                value={form.q120_femaleRelativeType}
                onChange={(val) => updateField('q120_femaleRelativeType', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="121" title="هل ملء الاستمارة تم بعلم العروسة ؟" required>
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q121_femaleWithBrideKnowledge}
                onChange={(val) => updateField('q121_femaleWithBrideKnowledge', val)}
              />
            </QuestionBlock>

            <QuestionBlock
              number="122"
              title="صورة بطاقة سارية لمرسل الإستمارة مع إخفاء الرقم القومي وإظهار أول 6 أرقام من اليسار (الوجه الأمامي)"
            >
              <IdSampleIllustration side="front" />
              <FileUploadBox
                value={form.q122_femaleRelativeIdFront}
                onChange={(val) => updateField('q122_femaleRelativeIdFront', val)}
                label="ارفع صورة البطاقة الأمامية لمرسل الاستمارة (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock
              number="123"
              title="صورة بطاقة سارية لمرسل الإستمارة مع إخفاء الرقم القومي وإظهار أول 6 أرقام من اليسار (الوجه الخلفي)"
            >
              <IdSampleIllustration side="back" />
              <FileUploadBox
                value={form.q123_femaleRelativeIdBack}
                onChange={(val) => updateField('q123_femaleRelativeIdBack', val)}
                label="ارفع صورة البطاقة الخلفية لمرسل الاستمارة (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock number="124" title="هل لديك إضافة أو ملحوظة أخرى؟">
              <input
                type="text"
                value={form.q124_femaleRelativeNotes}
                onChange={(e) => updateField('q124_femaleRelativeNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>
          </div>
        )}

        {currentSection?.id === 'sec_female_conclusion' && (
          <div className="space-y-5">
            <QuestionBlock
              number="151"
              title="رقم هاتف العروسة (من البيانات السرية التي لا تظهر في الاستمارة)"
            >
              <input
                type="tel"
                value={form.q151_femaleSecretPhone}
                onChange={(e) => updateField('q151_femaleSecretPhone', e.target.value)}
                placeholder="مثال: 01122334455"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/40 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock
              number="152"
              title="رقم هاتف ولي الأمر (من البيانات السرية التي لا تظهر في الاستمارة ولا يُنشر ويُرسل لصاحب الاستمارة المناسبة لكي بعد موافقتك الشخصية عليها)"
            >
              <input
                type="tel"
                value={form.q152_femaleGuardianSecretPhone}
                onChange={(e) => updateField('q152_femaleGuardianSecretPhone', e.target.value)}
                placeholder="مثال: 01099887766"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/40 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock
              number="153"
              title="رابط حسابك علي الفيسبوك اللي بتكلمنا منه (من البيانات السرية التي لا تظهر في الاستمارة)"
            >
              <input
                type="url"
                value={form.q153_femaleSecretFb}
                onChange={(e) => updateField('q153_femaleSecretFb', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-amber-50/40 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock
              number="154"
              title="صورة بطاقة سارية للعروسة مع إخفاء الرقم القومي وإظهار أول 6 أرقام من اليسار (الوجه الأمامي)"
            >
              <IdSampleIllustration side="front" />
              <FileUploadBox
                value={form.q154_femaleIdFront}
                onChange={(val) => updateField('q154_femaleIdFront', val)}
                label="ارفع صورة البطاقة الأمامية للعروسة (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock
              number="155"
              title="صورة بطاقة سارية للعروسة مع إخفاء الرقم القومي وإظهار أول 6 أرقام من اليسار (الوجه الخلفي)"
            >
              <IdSampleIllustration side="back" />
              <FileUploadBox
                value={form.q155_femaleIdBack}
                onChange={(val) => updateField('q155_femaleIdBack', val)}
                label="ارفع صورة البطاقة الخلفية للعروسة (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock number="156" title="صورة شخصية واضحة وحديثة">
              <FileUploadBox
                value={form.q156_femalePersonalPhoto}
                onChange={(val) => updateField('q156_femalePersonalPhoto', val)}
                label="ارفع صورة شخصية واضحة وحديثة (سرية للإدارة فقط)"
              />
            </QuestionBlock>

            <QuestionBlock
              number="157"
              title="هل توافقين على نشر استمارتك على صفحتنا بالفيسبوك؟"
              required
            >
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q157_femalePublishFb}
                onChange={(val) => updateField('q157_femalePublishFb', val)}
              />
            </QuestionBlock>

            <QuestionBlock
              number="158"
              title="هل توافقين على نشر استمارتك على قناتنا بالتليجرام؟"
              required
            >
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q158_femalePublishTelegram}
                onChange={(val) => updateField('q158_femalePublishTelegram', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="159" title="هل سبق لكِ مراسلتنا من حساب آخر؟">
              <RadioGroup
                options={['نعم', 'لا']}
                value={form.q159_femalePrevContact}
                onChange={(val) => updateField('q159_femalePrevContact', val)}
              />
            </QuestionBlock>

            <QuestionBlock number="160" title="هل لديكِ إضافة أو ملحوظة أخرى؟">
              <textarea
                rows={2}
                value={form.q160_femaleFinalNotes}
                onChange={(e) => updateField('q160_femaleFinalNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
              />
            </QuestionBlock>

            <QuestionBlock number="161" title="إقرار وتعهد" required>
              <label className="flex items-start gap-3 p-4 rounded-2xl border-2 border-emerald-700 bg-emerald-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.q161_femalePledge}
                  onChange={(e) => updateField('q161_femalePledge', e.target.checked)}
                  className="mt-1 w-5 h-5 accent-emerald-800 shrink-0"
                />
                <span className="text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed">
                  أشهد الله أن جميع البيانات المذكورة في هذه الاستمارة صحيحة وحقيقية، وأتحمل المسؤولية الكاملة أمام الله ثم أمام إدارة الصفحة في حال وجود أي بيانات غير صحيحة.
                </span>
              </label>
            </QuestionBlock>
          </div>
        )}

        {stepError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition ${
              stepIndex === 0
                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition"
          >
            <span>{isLastStep ? 'إرسال الاستمارة واستلام كود المتابعة' : 'التالي'}</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// مكونات مساعدة لحقول الاستمارة
// ============================================================================

function QuestionBlock({ number, title, required, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-stone-800">
        <span className="inline-block font-mono text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md ml-2 border border-stone-200">
          {number}
        </span>
        {title}
        {required && <span className="text-red-600 mr-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionBanner({ title }) {
  return (
    <div className="bg-emerald-900/5 border-r-4 border-emerald-800 px-4 py-2.5 rounded-l-xl">
      <h4 className="font-extrabold text-emerald-950 text-sm">{title}</h4>
    </div>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-4 py-2.5 rounded-xl border text-right text-xs sm:text-sm transition flex items-center justify-between gap-2 ${
              selected
                ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold shadow-sm'
                : 'border-stone-200 hover:border-stone-300 text-stone-700'
            }`}
          >
            <span>{option}</span>
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                selected ? 'border-emerald-700 bg-emerald-700' : 'border-stone-300'
              }`}
            >
              {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CheckboxGroup({ options, values = [], onToggle }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((option) => {
        const checked = values.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`px-4 py-2.5 rounded-xl border text-right text-xs sm:text-sm transition flex items-center justify-between gap-2 ${
              checked
                ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold shadow-sm'
                : 'border-stone-200 hover:border-stone-300 text-stone-700'
            }`}
          >
            <span>{option}</span>
            <span
              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                checked ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300'
              }`}
            >
              {checked && <Check className="w-3 h-3" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SelectDropdown({ options, value, onChange, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function FileUploadBox({ value, onChange, label }) {
  return (
    <div className="p-3.5 rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 text-xs text-stone-600">
        <Upload className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>{value ? `تم اختيار الملف: ${value}` : label}</span>
      </div>
      <label className="px-3.5 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-xs font-bold text-stone-700 cursor-pointer shrink-0 transition">
        <span>اختيار صورة / ملف</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file.name);
          }}
        />
      </label>
    </div>
  );
}
