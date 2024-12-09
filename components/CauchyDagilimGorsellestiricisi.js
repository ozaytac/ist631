// ... [önceki importlar ve yardımcı fonksiyonlar aynı] ...

// MLT için örneklem ortalamaları hesaplama
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
      freq: freq / (maxFreq * binSize * 2)
    }));
};

const CauchyDagilimGorsellestiricisi = () => {
  const [konumParametresi, setKonumParametresi] = useState(0);
  const [olcekParametresi, setOlcekParametresi] = useState(1);
  const [pdfVerileri, setPDFVerileri] = useState([]);
  const [cdfVerileri, setCDFVerileri] = useState([]);
  const [orneklemVerileri, setOrneklemVerileri] = useState([]);
  const [mlt5Veriler, setMLT5Veriler] = useState([]);
  const [mlt10Veriler, setMLT10Veriler] = useState([]);
  const [mlt30Veriler, setMLT30Veriler] = useState([]);
  const [mlt50Veriler, setMLT50Veriler] = useState([]);
  const [loading, setLoading] = useState(false);

  const yeniOrneklemCek = () => {
    setLoading(true);

    // Normal örneklem dağılımı
    const orneklem = Array.from({ length: 1000 }, () => ({
      x: cauchyRandom(konumParametresi, olcekParametresi)
    })).sort((a, b) => a.x - b.x);

    const histogram = new Map();
    const binSize = 0.5;
    orneklem.forEach(point => {
      const bin = Math.floor(point.x / binSize) * binSize;
      histogram.set(bin, (histogram.get(bin) || 0) + 1);
    });

    const maxFreq = Math.max(...histogram.values());
    const orneklemGorsellestirme = Array.from(histogram.entries())
      .map(([bin, freq]) => ({
        x: bin,
        freq: freq / (maxFreq * binSize * 2)
      }));

    // MLT örneklemleri
    const mlt5 = generateMLTSamples(5, 1000, konumParametresi, olcekParametresi);
    const mlt10 = generateMLTSamples(10, 1000, konumParametresi, olcekParametresi);
    const mlt30 = generateMLTSamples(30, 1000, konumParametresi, olcekParametresi);
    const mlt50 = generateMLTSamples(50, 1000, konumParametresi, olcekParametresi);

    setOrneklemVerileri(orneklemGorsellestirme);
    setMLT5Veriler(mlt5);
    setMLT10Veriler(mlt10);
    setMLT30Veriler(mlt30);
    setMLT50Veriler(mlt50);
    setLoading(false);
  };

  // ... [useEffect aynı] ...

  return (
    <div className="container mx-auto p-4">
      {/* ... [başlık ve kontrol paneli aynı] ... */}

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Teorik PDF */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-bold mb-4">Teorik Olasılık Yoğunluk Fonksiyonu (PDF)</h3>
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

        {/* Örneklem Dağılımı */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-bold mb-4">Örneklem Dağılımı (n=1000)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orneklemVerileri}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" domain={[-10, 10]} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="freq" stroke="#82ca9d" name="Örneklem Dağılımı" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CDF */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-bold mb-4">Kümülatif Dağılım Fonksiyonu (CDF)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cdfVerileri}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cdf" stroke="#8884d8" dot={false} name="CDF" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MLT Grafikleri */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-bold mb-4">Merkezi Limit Teoremi Test Grafikleri</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold mb-2">n=5</p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={mlt5Veriler}>
                  <XAxis dataKey="x" type="number" domain={[-10, 10]} />
                  <YAxis />
                  <Line type="monotone" dataKey="freq" stroke="#8884d8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">n=10</p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={mlt10Veriler}>
                  <XAxis dataKey="x" type="number" domain={[-10, 10]} />
                  <YAxis />
                  <Line type="monotone" dataKey="freq" stroke="#82ca9d" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">n=30</p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={mlt30Veriler}>
                  <XAxis dataKey="x" type="number" domain={[-10, 10]} />
                  <YAxis />
                  <Line type="monotone" dataKey="freq" stroke="#ff7300" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">n=50</p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={mlt50Veriler}>
                  <XAxis dataKey="x" type="number" domain={[-10, 10]} />
                  <YAxis />
                  <Line type="monotone" dataKey="freq" stroke="#0088fe" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="text-sm mt-4">
            Her grafik 1000 örneklemin ortalamasını göstermektedir. 
            Örneklem boyutu (n) arttıkça dağılımın normal dağılıma yakınsamaması, 
            Cauchy dağılımının özel bir özelliğidir.
          </p>
        </div>
      </div>

      {/* ... [açıklama kısmı aynı] ... */}
    </div>
  );
};

export default CauchyDagilimGorsellestiricisi;
