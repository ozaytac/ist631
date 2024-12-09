import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const cauchyPDF = (x, konumParametresi, olcekParametresi) => {
 return 1 / (Math.PI * olcekParametresi * (1 + Math.pow((x - konumParametresi) / olcekParametresi, 2)));
};

const cauchyCDF = (x, konumParametresi, olcekParametresi) => {
 return 0.5 + (1 / Math.PI) * Math.atan((x - konumParametresi) / olcekParametresi);
};

const cauchyRandom = (konum, olcek) => {
 const u = Math.random();
 return konum + olcek * Math.tan(Math.PI * (u - 0.5));
};

const generateMLTSamples = (sampleSize, numSamples, konum, olcek) => {
 const histogram = new Map();
 const binSize = 0.5;

 for (let i = 0; i < numSamples; i++) {
   let sum = 0;
   for (let j = 0; j < sampleSize; j++) {
     sum += cauchyRandom(konum, olcek);
   }
   const mean = sum / sampleSize;
   const bin = Math.floor(mean / binSize) * binSize;
   histogram.set(bin, (histogram.get(bin) || 0) + 1);
 }

 const maxFreq = Math.max(...histogram.values());
 return Array.from(histogram.entries())
   .map(([bin, freq]) => ({
     x: bin,
     freq: freq / maxFreq
   }))
   .sort((a, b) => a.x - b.x);
};

const CauchyDagilimGorsellestiricisi = () => {
 const [konumParametresi, setKonumParametresi] = useState(0);
 const [olcekParametresi, setOlcekParametresi] = useState(1);
 const [pdfVerileri, setPDFVerileri] = useState([]);
 const [cdfVerileri, setCDFVerileri] = useState([]);
 const [mlt5Veriler, setMLT5Veriler] = useState([]);
 const [mlt10Veriler, setMLT10Veriler] = useState([]);
 const [mlt30Veriler, setMLT30Veriler] = useState([]);
 const [mlt50Veriler, setMLT50Veriler] = useState([]);
 const [loading, setLoading] = useState(false);

 const yeniOrneklemCek = () => {
   setLoading(true);

   const mlt5 = generateMLTSamples(5, 5000, konumParametresi, olcekParametresi);
   const mlt10 = generateMLTSamples(10, 5000, konumParametresi, olcekParametresi);
   const mlt30 = generateMLTSamples(30, 5000, konumParametresi, olcekParametresi);
   const mlt50 = generateMLTSamples(50, 5000, konumParametresi, olcekParametresi);

   setMLT5Veriler(mlt5);
   setMLT10Veriler(mlt10);
   setMLT30Veriler(mlt30);
   setMLT50Veriler(mlt50);
   setLoading(false);
 };

 useEffect(() => {
   const veriler = [];
   for (let x = -20; x <= 20; x += 0.2) {
     veriler.push({
       x: Number(x.toFixed(2)),
       pdf: cauchyPDF(x, konumParametresi, olcekParametresi),
       cdf: cauchyCDF(x, konumParametresi, olcekParametresi)
     });
   }
   setPDFVerileri(veriler);
   setCDFVerileri(veriler);
   yeniOrneklemCek();
 }, [konumParametresi, olcekParametresi]);

 return (
   <div className="container mx-auto p-4">
     <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
       <h2 className="text-xl font-bold text-blue-800 text-center">
         İST631 - Kuramsal İstatistik Dersi Uygulama Ödevi
       </h2>
       <h3 className="text-lg text-blue-700 text-center mt-2">
         Ara Sınav Ödevi: Cauchy Dağılımı Görselleştiricisi
       </h3>
       <div className="text-center mt-2 text-blue-600">
         <p>Öğretim Üyesi: Doç. Dr. Ayten Yiğiter</p>
         <p>Öğrenci: N23235557 - Mustafa Özaytaç</p>
       </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
       <div className="bg-white rounded-lg shadow-lg p-4">
         <h3 className="text-lg font-bold mb-4">Konum Parametresi (x0)</h3>
         <input
           type="range"
           min="-10"
           max="10"
           step="0.1"
           value={konumParametresi}
           onChange={(e) => setKonumParametresi(Number(e.target.value))}
           className="w-full"
         />
         <span className="text-sm">Değer: {konumParametresi.toFixed(2)}</span>
       </div>

       <div className="bg-white rounded-lg shadow-lg p-4">
         <h3 className="text-lg font-bold mb-4">Ölçek Parametresi</h3>
         <input
           type="range"
           min="0.1"
           max="5"
           step="0.1"
           value={olcekParametresi}
           onChange={(e) => setOlcekParametresi(Number(e.target.value))}
           className="w-full"
         />
         <span className="text-sm">Değer: {olcekParametresi.toFixed(2)}</span>
         <button
           onClick={yeniOrneklemCek}
           disabled={loading}
           className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
         >
           {loading ? "Hesaplanıyor..." : "Yeni Örneklem Çek"}
         </button>
       </div>
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
       <div className="bg-white rounded-lg shadow-lg p-4">
         <h3 className="text-lg font-bold mb-4">Teorik PDF</h3>
         <ResponsiveContainer width="100%" height={300}>
           <LineChart data={pdfVerileri}>
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis dataKey="x" type="number" domain={[-10, 10]} />
             <YAxis />
             <Tooltip />
             <Legend />
             <Line type="monotone" dataKey="pdf" stroke="#8884d8" name="Teorik PDF" dot={false} />
           </LineChart>
         </ResponsiveContainer>
       </div>

       <div className="bg-white rounded-lg shadow-lg p-4">
         <h3 className="text-lg font-bold mb-4">CDF</h3>
         <ResponsiveContainer width="100%" height={300}>
           <LineChart data={cdfVerileri}>
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis dataKey="x" />
             <YAxis />
             <Tooltip />
             <Legend />
             <Line type="monotone" dataKey="cdf" stroke="#8884d8" name="CDF" dot={false} />
           </LineChart>
         </ResponsiveContainer>
       </div>
     </div>

     <div className="bg-white rounded-lg shadow-lg p-4">
       <h3 className="text-lg font-bold mb-4">MLT Test Grafikleri (Her biri 5000 örneklem)</h3>
       <div className="grid grid-cols-2 gap-4">
         <div>
           <p className="text-sm font-semibold mb-2">n=5</p>
           <ResponsiveContainer width="100%" height={200}>
             <LineChart data={mlt5Veriler}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="x" type="number" domain={[-10, 10]} />
               <YAxis domain={[0, 'auto']} />
               <Tooltip />
               <Line type="step" dataKey="freq" stroke="#8884d8" dot={false} />
             </LineChart>
           </ResponsiveContainer>
         </div>
         <div>
           <p className="text-sm font-semibold mb-2">n=10</p>
           <ResponsiveContainer width="100%" height={200}>
             <LineChart data={mlt10Veriler}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="x" type="number" domain={[-10, 10]} />
               <YAxis domain={[0, 'auto']} />
               <Tooltip />
               <Line type="step" dataKey="freq" stroke="#82ca9d" dot={false} />
             </LineChart>
           </ResponsiveContainer>
         </div>
         <div>
           <p className="text-sm font-semibold mb-2">n=30</p>
           <ResponsiveContainer width="100%" height={200}>
             <LineChart data={mlt30Veriler}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="x" type="number" domain={[-10, 10]} />
               <YAxis domain={[0, 'auto']} />
               <Tooltip />
               <Line type="step" dataKey="freq" stroke="#ff7300" dot={false} />
             </LineChart>
           </ResponsiveContainer>
         </div>
         <div>
           <p className="text-sm font-semibold mb-2">n=50</p>
           <ResponsiveContainer width="100%" height={200}>
             <LineChart data={mlt50Veriler}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="x" type="number" domain={[-10, 10]} />
               <YAxis domain={[0, 'auto']} />
               <Tooltip />
               <Line type="step" dataKey="freq" stroke="#0088fe" dot={false} />
             </LineChart>
           </ResponsiveContainer>
         </div>
       </div>
     </div>

     <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
       <h3 className="text-xl font-bold mb-4">Cauchy Dağılımı ve MLT</h3>
       <div className="space-y-4">
         <p>
           Cauchy dağılımı, ağır kuyruklu bir olasılık dağılımıdır. 
           Bu dağılımın en önemli özelliklerinden biri, Merkezi Limit Teoremi'nin 
           geçerli olmamasıdır. Örneklem boyutu artsa bile, örneklem ortalamaları 
           normal dağılıma yakınsamaz.
         </p>
       </div>
     </div>
   </div>
 );
};

export default CauchyDagilimGorsellestiricisi;
