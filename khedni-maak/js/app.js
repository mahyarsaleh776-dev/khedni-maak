// ============================================================
// Khedni Ma'ak
// app.js
// ============================================================


// ============================================================
// 1) الوصول إلى عناصر HTML
// ============================================================

// عناصر نموذج البحث
const form = document.getElementById("tripSearchForm");

const originInput = document.getElementById("origin");

const destinationInput = document.getElementById("destination");

const timeInput = document.getElementById("time");


// مكان عرض الرحلات
const tripResults = document.getElementById("tripResults");


// رسالة البحث
const message = document.getElementById("searchMessage");


// ============================================================
// 2) متغيرات التطبيق
// ============================================================

// في البداية لا توجد بيانات
let drivers = [];


// الحد الأقصى للرحلات التي سنعرضها
const MAX_RESULTS = 5;


// أقصى فرق زمني مسموح به
// 30 دقيقة = نصف ساعة
const TIME_TOLERANCE = 30;


// ============================================================
// 3) تحميل بيانات السائقين من drivers.json
// ============================================================

async function loadDrivers() {

  try {

    // إرسال طلب للحصول على ملف JSON
    const response = await fetch("drivers.json");


    // التأكد من أن الطلب نجح
    if (!response.ok) {

      throw new Error(`HTTP ${response.status}`);

    }


    // تحويل JSON إلى JavaScript
    drivers = await response.json();


    // عرض جميع الرحلات عند فتح الصفحة
    renderTrips(getAllTrips());


  } catch (error) {

    // عرض رسالة للمستخدم
    tripResults.innerHTML = `
      <div class="empty-results">
        تعذر تحميل بيانات الرحلات.
      </div>
    `;


    // عرض الخطأ للمطور في Console
    console.error("Drivers error:", error);

  }

}


// ============================================================
// 4) الحصول على جميع الرحلات
// ============================================================

function getAllTrips() {

  return drivers.flatMap(driver =>

    driver.trips.map(trip => ({

      driver: driver,

      trip: trip

    }))

  );

}


// ============================================================
// 5) تحويل الوقت إلى دقائق
// ============================================================

function toMinutes(time) {

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;

}


// مثال:
//
// 08:30
//
// 8 × 60 + 30
//
// = 510 دقيقة
//
// وهذا يجعل مقارنة الأوقات أسهل.


// ============================================================
// 6) التحقق من اسم المكان باستخدام Regex
// ============================================================

function isValidLocation(location) {

  // يسمح بالحروف العربية والإنجليزية والمسافات
  const locationRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;

  return locationRegex.test(location);

}


// ============================================================
// 7) البحث عن الرحلات
// ============================================================

// نقطتي الراكب (origin/destination) لازم يكونوا موجودين ضمن
// مسار السائق (route) بس، وبنفس ترتيب حركته — مو شرط يكونوا
// أول وآخر نقطة بالمسار.
// مثال: مسار السائق [دمر، كفرسوسة، البرامكة]
//       راكب طالب كفرسوسة → البرامكة  ⇦ لازم تطلع بالنتيجة
//       راكب طالب البرامكة → كفرسوسة  ⇦ ما تطلع (اتجاه معاكس)
function routeMatches(route, origin, destination) {

  const originIndex = route.indexOf(origin);
  const destinationIndex = route.indexOf(destination);

  return (
    originIndex !== -1 &&
    destinationIndex !== -1 &&
    originIndex < destinationIndex
  );

}


function searchTrips(origin, destination, time) {


  // الحصول على جميع الرحلات
  const allTrips = getAllTrips();


  // تحويل الوقت المطلوب إلى دقائق
  const requestedMinutes = toMinutes(time);


  // filter للحصول على الرحلات المناسبة
  const results = allTrips.filter(({ trip }) => {


    // هل الانطلاق والوجهة موجودين بترتيب صحيح ضمن مسار الرحلة؟
    const stopsMatch =
      routeMatches(trip.route, origin, destination);


    // فرق الوقت بين طلب المستخدم ووقت الرحلة
    const timeDifference =
      Math.abs(
        toMinutes(trip.departureTime) -
        requestedMinutes
      );


    // الرحلة مناسبة إذا:
    //
    // 1. الانطلاق والوجهة موجودين بترتيب صحيح بالمسار
    // 2. يوجد مقعد
    // 3. فرق الوقت ضمن الحد المسموح

    return (
      stopsMatch &&
      trip.availableSeats > 0 &&
      timeDifference <= TIME_TOLERANCE
    );

  });


  // ==========================================================
  // ترتيب النتائج
  // ==========================================================

  results.sort((a, b) => {


    // فرق وقت الرحلة الأولى
    const timeA =
      Math.abs(
        toMinutes(a.trip.departureTime) -
        requestedMinutes
      );


    // فرق وقت الرحلة الثانية
    const timeB =
      Math.abs(
        toMinutes(b.trip.departureTime) -
        requestedMinutes
      );


    // أولاً: الأقرب إلى الوقت المطلوب
    if (timeA !== timeB) {

      return timeA - timeB;

    }


    // إذا كان الوقت متساويًا:
    // نرتب حسب تقييم السائق
    return b.driver.rating - a.driver.rating;

  });


  return results;

}


// ============================================================
// 8) عرض الرحلات على الصفحة
// ============================================================

// riderOrigin/riderDestination: النقطتين اللي الراكب طلبهم فعليًا
// (مو بالضرورة أول وآخر نقطة بمسار السائق). لو ما انطلب بحث بعد
// (عرض أولي عند فتح الصفحة)، منستخدم طرفي المسار كقيمة افتراضية.
function renderTrips(results, riderOrigin = null, riderDestination = null) {


  // إذا لم توجد نتائج
  if (results.length === 0) {

    tripResults.innerHTML = `
      <div class="empty-results">
        لا توجد رحلات مطابقة للبحث.
      </div>
    `;

    return;

  }


  // نعرض فقط أول 5 رحلات
  const limitedResults =
    results.slice(0, MAX_RESULTS);


  // تحويل النتائج إلى HTML
  tripResults.innerHTML = limitedResults
    .map(({ driver, trip }) => {


      // إنشاء مسار الرحلة
      const routeHTML = trip.route
        .map((place, index) => {

          return `
            <span>${place}</span>

            ${
              index < trip.route.length - 1
                ? "<b>←</b>"
                : ""
            }
          `;

        })
        .join("");


      return `
        <article class="trip-card">

          <div class="driver-avatar avatar-orange">
            ${driver.name.charAt(0)}
          </div>


          <div class="trip-main">

            <div class="trip-title-row">

              <h3>
                ${driver.name}
              </h3>

              <span class="rating">
                ★ ${driver.rating}
              </span>

            </div>


            <p class="car">
              ${driver.carModel}
            </p>


            <div class="trip-route">

              ${routeHTML}

            </div>


            <div class="trip-meta">

              <span>
                ${trip.departureTime}
              </span>

              <span class="available">
                ${trip.availableSeats}
                مقاعد متاحة
              </span>

            </div>

          </div>


          <button
            class="btn btn-secondary trip-action"
            type="button"
            data-driver-id="${driver.id}"
            data-departure="${trip.departureTime}"
            data-origin="${riderOrigin || trip.route[0]}"
            data-destination="${riderDestination || trip.route[trip.route.length - 1]}"
          >
            طلب رحلة
          </button>

        </article>
      `;

    })
    .join("");


  // بعد إنشاء الأزرار
  // نربط Event لكل زر
  attachTripButtons();

}


// ============================================================
// 9) التعامل مع أزرار "طلب رحلة"
// ============================================================

function attachTripButtons() {


  const buttons =
    document.querySelectorAll(".trip-action");


  buttons.forEach(button => {


    button.addEventListener("click", () => {


      // قراءة معلومات الرحلة من data attributes
      const driverId =
        Number(button.dataset.driverId);


      const departureTime =
        button.dataset.departure;


      const origin =
        button.dataset.origin;


      const destination =
        button.dataset.destination;


      // إرسال الطلب
      requestTrip(
        driverId,
        departureTime,
        origin,
        destination,
        button
      );

    });

  });

}


// ============================================================
// 10) إرسال طلب رحلة وحفظه في localStorage
// ============================================================

function requestTrip(
  driverId,
  departureTime,
  origin,
  destination,
  button
) {


  // قراءة الطلبات القديمة
  const requests =
    JSON.parse(
      localStorage.getItem("tripRequests")
    ) || [];


  // إنشاء Set من الرحلات التي طلبها المستخدم سابقًا
  const requestedTrips =
    new Set(
      requests.map(request =>
        request.tripKey
      )
    );


  // إنشاء معرف فريد للرحلة
  const tripKey =
    `${driverId}-${departureTime}-${origin}-${destination}`;


  // منع الطلب المكرر
  if (requestedTrips.has(tripKey)) {

    button.textContent =
      "تم طلب هذه الرحلة مسبقًا";

    button.disabled = true;

    return;

  }


  // إنشاء طلب جديد
  const newRequest = {

    tripKey: tripKey,

    driverId: driverId,

    origin: origin,

    destination: destination,

    departureTime: departureTime,

    status: "pending",

    createdAt: new Date().toISOString()

  };


  // إضافة الطلب إلى المصفوفة
  requests.push(newRequest);


  // حفظ البيانات
  localStorage.setItem(
    "tripRequests",
    JSON.stringify(requests)
  );


  // تحديث الزر
  button.textContent =
    "تم إرسال الطلب ✓";


  button.disabled = true;


  // رسالة للمستخدم
  message.textContent =
    "تم إرسال طلب الرحلة بنجاح.";


  message.className =
    "search-message success";

}


// ============================================================
// 11) حدث البحث
// ============================================================

form.addEventListener("submit", event => {


  // منع إعادة تحميل الصفحة
  event.preventDefault();


  // قراءة البيانات من المستخدم
  const origin =
    originInput.value.trim();


  const destination =
    destinationInput.value.trim();


  const time =
    timeInput.value;


  // ==========================================================
  // التحقق من البيانات
  // ==========================================================

  if (
    !origin ||
    !destination ||
    !time
  ) {

    message.textContent =
      "يرجى إدخال نقطة الانطلاق والوجهة والوقت.";

    message.className =
      "search-message error";

    return;

  }


  // التحقق باستخدام Regex
  if (
    !isValidLocation(origin) ||
    !isValidLocation(destination)
  ) {

    message.textContent =
      "يرجى إدخال أسماء أماكن صحيحة.";

    message.className =
      "search-message error";

    return;

  }


  // ==========================================================
  // البحث
  // ==========================================================

  const results =
    searchTrips(
      origin,
      destination,
      time
    );


  // عرض النتائج (مع تمرير نقطتي الراكب الفعليتين لاستخدامهم بزر الطلب)
  renderTrips(results, origin, destination);


  // رسالة النتيجة
  message.textContent =
    `تم العثور على ${results.length} رحلة مناسبة.`;


  message.className =
    results.length > 0
      ? "search-message success"
      : "search-message";

});


// ============================================================
// 12) بيانات المدن للـ Weather API
// ============================================================

const cities = {

  damascus: {
    name: "دمشق",
    latitude: 33.5138,
    longitude: 36.2765
  },

  aleppo: {
    name: "حلب",
    latitude: 36.2021,
    longitude: 37.1343
  },

  homs: {
    name: "حمص",
    latitude: 34.7324,
    longitude: 36.7137
  },

  latakia: {
    name: "اللاذقية",
    latitude: 35.5317,
    longitude: 35.7918
  },

  tartus: {
    name: "طرطوس",
    latitude: 34.8890,
    longitude: 35.8866
  }

};


// ============================================================
// 13) الوصول إلى عناصر الطقس
// ============================================================

const weatherCity =
  document.getElementById("weatherCity");


const weatherTemp =
  document.getElementById("weatherTemp");


const weatherCondition =
  document.getElementById("weatherCondition");


const weatherHumidity =
  document.getElementById("weatherHumidity");


const weatherWind =
  document.getElementById("weatherWind");


const weatherFeels =
  document.getElementById("weatherFeels");


const weatherUpdated =
  document.getElementById("weatherUpdated");


const weatherStatus =
  document.getElementById("weatherStatus");


// ============================================================
// 14) وصف حالة الطقس
// ============================================================

function getWeatherDescription(code) {


  const descriptions = {

    0: "سماء صافية",

    1: "غالبًا صافٍ",

    2: "غائم جزئيًا",

    3: "غائم",

    45: "ضباب",

    48: "ضباب متجمد",

    51: "رذاذ خفيف",

    53: "رذاذ متوسط",

    55: "رذاذ كثيف",

    61: "مطر خفيف",

    63: "مطر متوسط",

    65: "مطر غزير",

    71: "ثلج خفيف",

    73: "ثلج متوسط",

    75: "ثلج غزير",

    80: "زخات مطر خفيفة",

    81: "زخات مطر متوسطة",

    82: "زخات مطر قوية",

    95: "عاصفة رعدية"

  };


  return (
    descriptions[code] ||
    "حالة جوية غير معروفة"
  );

}


// ============================================================
// 15) جلب الطقس من Open-Meteo API
// ============================================================

async function loadWeather(
  cityKey = "damascus"
) {


  // الحصول على بيانات المدينة
  const city =
    cities[cityKey];


  // تحديث الواجهة أثناء التحميل
  weatherCity.textContent =
    city.name;


  weatherCondition.textContent =
    "جاري تحميل الطقس...";


  weatherStatus.textContent =
    "جاري الاتصال بخدمة الطقس...";


  // ==========================================================
  // بناء رابط API
  // ==========================================================

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.latitude}` +
    `&longitude=${city.longitude}` +
    `&current=` +
    `temperature_2m,` +
    `relative_humidity_2m,` +
    `apparent_temperature,` +
    `weather_code,` +
    `wind_speed_10m` +
    `&timezone=Asia%2FDamascus`;


  try {


    // إرسال الطلب
    const response =
      await fetch(url);


    // التحقق من نجاح الطلب
    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    // تحويل JSON إلى JavaScript object
    const data =
      await response.json();


    // الوصول إلى بيانات الطقس الحالية
    const current =
      data.current;


    // ========================================================
    // تحديث HTML
    // ========================================================

    weatherTemp.textContent =
      `${Math.round(
        current.temperature_2m
      )}°C`;


    weatherCondition.textContent =
      getWeatherDescription(
        current.weather_code
      );


    weatherHumidity.textContent =
      `${current.relative_humidity_2m}%`;


    weatherWind.textContent =
      `${Math.round(
        current.wind_speed_10m
      )} كم/س`;


    weatherFeels.textContent =
      `${Math.round(
        current.apparent_temperature
      )}°C`;


    weatherUpdated.textContent =
      current.time.replace(
        "T",
        " "
      );


    weatherStatus.textContent =
      "تم تحديث البيانات بنجاح ✓";


  } catch (error) {


    // في حالة فشل API
    weatherCondition.textContent =
      "تعذر تحميل الطقس";


    weatherStatus.textContent =
      "حدث خطأ أثناء الاتصال بخدمة الطقس.";


    console.error(
      "Weather API error:",
      error
    );

  }

}


// ============================================================
// 16) أزرار المدن
// ============================================================

const cityButtons =
  document.querySelectorAll(".city-button");


cityButtons.forEach(button => {


  button.addEventListener(
    "click",
    () => {


      // إزالة active من جميع الأزرار
      cityButtons.forEach(btn => {

        btn.classList.remove("active");

      });


      // إضافة active للزر الحالي
      button.classList.add("active");


      // معرفة المدينة من data-city
      const cityKey =
        button.dataset.city;


      // تحميل الطقس
      loadWeather(cityKey);

    }
  );

});


// ============================================================
// 17) تشغيل التطبيق
// ============================================================

// تحميل بيانات الرحلات
loadDrivers();


// تحميل طقس دمشق عند فتح الصفحة
loadWeather("damascus");