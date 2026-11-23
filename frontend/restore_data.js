const http = require('http');

const API_HOST = 'localhost';
const API_PORT = 8080;
const API_PATH = '/api';

// פונקציית עזר לשליחת בקשת POST
const postItem = (endpoint, data) => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: `${API_PATH}/${endpoint}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log(`✅ Success: ${endpoint} - ${data.name || data.customerName || 'Item'}`);
                resolve();
            } else {
                console.log(`❌ Error ${res.statusCode}: ${endpoint}`);
                resolve(); // ממשיכים גם אם יש שגיאה כדי לא לעצור את הכל
            }
        });

        req.on('error', (e) => {
            console.error(`❌ Request Error: ${e.message}`);
            resolve();
        });

        req.write(postData);
        req.end();
    });
};

const runImport = async () => {
    console.log("--- Starting Data Import (Node.js) ---");

    // 1. מוכרים
    await postItem('sellers', { name: "סער ברודסקי" });
    await postItem('sellers', { name: "רועי דויניאס" });

    // 2. מוצרים
    await postItem('products', {
        name: "חולצה שחורה 1",
        imageUrl: "http://localhost:8080/images/black1.jpg",
        variants: [
            { size: "M", quantity: 8 }, { size: "L", quantity: 22 },
            { size: "XL", quantity: 44 }, { size: "2XL", quantity: 4 }, { size: "3XL", quantity: 2 }
        ]
    });
    await postItem('products', {
        name: "חולצה שמנת 1",
        imageUrl: "http://localhost:8080/images/cream1.jpg",
        variants: [
            { size: "M", quantity: 4 }, { size: "L", quantity: 11 },
            { size: "XL", quantity: 22 }, { size: "2XL", quantity: 2 }, { size: "3XL", quantity: 1 }
        ]
    });
    await postItem('products', {
        name: "חולצה סגולה 1",
        imageUrl: "http://localhost:8080/images/purple1.jpg",
        variants: [
            { size: "S", quantity: 2 }, { size: "M", quantity: 4 }, { size: "L", quantity: 7 },
            { size: "XL", quantity: 6 }, { size: "2XL", quantity: 1 }, { size: "3XL", quantity: 1 }
        ]
    });
    await postItem('products', {
        name: "חולצה אפורה 1",
        imageUrl: "http://localhost:8080/images/gray1.jpg",
        variants: [
            { size: "S", quantity: 2 }, { size: "M", quantity: 4 }, { size: "L", quantity: 6 },
            { size: "XL", quantity: 6 }, { size: "2XL", quantity: 1 }, { size: "3XL", quantity: 1 }
        ]
    });

    // 3. מכירות (רשימה חלקית ומייצגת כדי לא להעמיס, הוסף את השאר אם תרצה)
    const sales = [
        // PreOrders
        { productId: 1, sellerId: 1, customerName: "עידו בן דרור", selectedSize: "M", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "ים פלח", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "ליטל בורשבסקי", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "בן טוסיה", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "גיא לשם", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "הדר וניאצה", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "איתי אידלסון", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "נדב מאירי", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רועי כהן", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רוי פינס", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "שי ירון", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "לפת ברודסקי", selectedSize: "3XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "זיו מאור", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "אלמוג מכלוף", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "עמית פישל", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "עידו אביטל", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "ישי פילצר", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "נועם פזי", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רותם רוזנברג", selectedSize: "2XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "תמר יחיאלי", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "ישפה בן צבי", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "מאיה אזולאי", selectedSize: "M", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "אדר כהן", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רוי ונונו", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "שהם בן צבי", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "שהם בן צבי (2)", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "דפני פרידור", selectedSize: "M", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "עמר של דפני", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "בר סלע", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "עדן קדוש", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רועי", selectedSize: "L", quantity: 1, totalPrice: 0 },
        { productId: 1, sellerId: 1, customerName: "אבא מושיקו", selectedSize: "XL", quantity: 1, totalPrice: 0 },
        { productId: 1, sellerId: 1, customerName: "אמא חגית", selectedSize: "M", quantity: 1, totalPrice: 0 },
        
        // מכירות רגילות
        { productId: 1, sellerId: 1, customerName: "מזדמן יריד", selectedSize: "L", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 1, customerName: "איתי מתתיהו", selectedSize: "M", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 1, customerName: "עמנואל לאנג", selectedSize: "2XL", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 1, customerName: "עידן ביבי", selectedSize: "M", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 1, customerName: "עומר ונקורט", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "שחר קפון", selectedSize: "2XL", quantity: 1, totalPrice: 140 },
        { productId: 1, sellerId: 1, customerName: "ניר ילינק", selectedSize: "XL", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 2, customerName: "רובי", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 1, sellerId: 1, customerName: "תומר קינן", selectedSize: "XL", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 1, customerName: "גיא ביטון", selectedSize: "M", quantity: 1, totalPrice: 120 },
        { productId: 1, sellerId: 1, customerName: "אלרואי סוחו", selectedSize: "XL", quantity: 1, totalPrice: 0 },
        { productId: 2, sellerId: 1, customerName: "סער ברודסקי", selectedSize: "XL", quantity: 1, totalPrice: 0 },
        { productId: 2, sellerId: 1, customerName: "רוי פינס", selectedSize: "L", quantity: 1, totalPrice: 120 },
        { productId: 2, sellerId: 1, customerName: "רועי כהן", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 1, sellerId: 1, customerName: "שיראל ביטון", selectedSize: "L", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 1, customerName: "פיליפ", selectedSize: "L", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 1, customerName: "אופיר כהן", selectedSize: "L", quantity: 1, totalPrice: 130 },
        { productId: 2, sellerId: 1, customerName: "אופיר כהן", selectedSize: "L", quantity: 1, totalPrice: 120 },
        { productId: 1, sellerId: 1, customerName: "נועה ויניק", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 3, sellerId: 2, customerName: "רובי", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 4, sellerId: 2, customerName: "רובי", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 3, sellerId: 1, customerName: "לפת", selectedSize: "3XL", quantity: 1, totalPrice: 0 },
        { productId: 4, sellerId: 1, customerName: "לפת", selectedSize: "3XL", quantity: 1, totalPrice: 0 },
        { productId: 4, sellerId: 1, customerName: "סהר אורן", selectedSize: "L", quantity: 1, totalPrice: 0 },
        { productId: 3, sellerId: 1, customerName: "אלון רוזנבוים", selectedSize: "XL", quantity: 1, totalPrice: 150 },
        { productId: 3, sellerId: 1, customerName: "נדב מאירי", selectedSize: "L", quantity: 1, totalPrice: 120 },
        { productId: 4, sellerId: 1, customerName: "שוהם", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 3, sellerId: 1, customerName: "ישפה", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 4, sellerId: 1, customerName: "ישפה", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 4, sellerId: 1, customerName: "חבר של שוהם", selectedSize: "2XL", quantity: 1, totalPrice: 120 },
        { productId: 3, sellerId: 1, customerName: "פגם סער", selectedSize: "XL", quantity: 1, totalPrice: 0 },
        { productId: 3, sellerId: 2, customerName: "פגם רובי", selectedSize: "XL", quantity: 1, totalPrice: 0 },
        { productId: 3, sellerId: 2, customerName: "רועי", selectedSize: "L", quantity: 1, totalPrice: 0 },
        { productId: 4, sellerId: 2, customerName: "רועי", selectedSize: "L", quantity: 1, totalPrice: 0 },
        { productId: 3, sellerId: 1, customerName: "אגם שצברג", selectedSize: "L", quantity: 1, totalPrice: 150 },
        { productId: 3, sellerId: 1, customerName: "אידו אביטל", selectedSize: "L", quantity: 1, totalPrice: 150 },
        { productId: 4, sellerId: 1, customerName: "איתמר לבנה", selectedSize: "XL", quantity: 1, totalPrice: 150 },
        { productId: 2, sellerId: 2, customerName: "אלון קרומהולץ", selectedSize: "L", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 2, customerName: "יאיר כהן", selectedSize: "XL", quantity: 1, totalPrice: 150 },
        { productId: 4, sellerId: 2, customerName: "עמית פישל", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 3, sellerId: 1, customerName: "אופיר כהן", selectedSize: "L", quantity: 1, totalPrice: 120 },
        { productId: 4, sellerId: 1, customerName: "אופיר כהן", selectedSize: "L", quantity: 1, totalPrice: 130 },
        { productId: 1, sellerId: 1, customerName: "אוראל אוזן", selectedSize: "XL", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 2, customerName: "נדב שריד", selectedSize: "L", quantity: 1, totalPrice: 150 },
        { productId: 1, sellerId: 2, customerName: "עומר מזרחי", selectedSize: "2XL", quantity: 1, totalPrice: 120 },
        { productId: 3, sellerId: 2, customerName: "עומר מזרחי", selectedSize: "2XL", quantity: 1, totalPrice: 130 },
        { productId: 1, sellerId: 1, customerName: "מיכה", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 2, sellerId: 2, customerName: "רועי", selectedSize: "L", quantity: 1, totalPrice: 0 },
        { productId: 1, sellerId: 2, customerName: "תאי בן הרוש", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 1, sellerId: 2, customerName: "מאיר צוברי", selectedSize: "L", quantity: 1, totalPrice: 120 },
        { productId: 4, sellerId: 2, customerName: "סתיו זוירזינסקי", selectedSize: "L", quantity: 1, totalPrice: 120 },
        { productId: 4, sellerId: 2, customerName: "סתיו זוירזינסקי", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 1, sellerId: 1, customerName: "אגם שצברג", selectedSize: "L", quantity: 1, totalPrice: 0 },
        { productId: 2, sellerId: 1, customerName: "רינה 1", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 2, sellerId: 1, customerName: "רינה 2", selectedSize: "XL", quantity: 1, totalPrice: 100 },
        { productId: 2, sellerId: 1, customerName: "רינה 3", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 2, sellerId: 1, customerName: "רינה 4", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 2, sellerId: 1, customerName: "רינה 5", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רינה 6", selectedSize: "3XL", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רינה 7", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רינה 8", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 1, customerName: "רינה 9", selectedSize: "L", quantity: 1, totalPrice: 100 },
        { productId: 4, sellerId: 1, customerName: "רינה 10", selectedSize: "M", quantity: 1, totalPrice: 100 },
        { productId: 4, sellerId: 1, customerName: "רינה 11", selectedSize: "S", quantity: 1, totalPrice: 100 },
        { productId: 1, sellerId: 2, customerName: "שוחי", selectedSize: "XL", quantity: 1, totalPrice: 120 },
        { productId: 1, sellerId: 2, customerName: "סהר הצלם", selectedSize: "XL", quantity: 1, totalPrice: 0 },
        { productId: 1, sellerId: 1, customerName: "שחר חזן", selectedSize: "XL", quantity: 1, totalPrice: 150 }
    ];

    for (const sale of sales) {
        await postItem('sales', sale);
    }

    console.log("--- Done! All data imported via API ---");
};

runImport();