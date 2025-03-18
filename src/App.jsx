import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [turn, setTurn] = useState(1);
  const [money, setMoney] = useState(5);
  const [exhibits, setExhibits] = useState([]);
  const [score, setScore] = useState(0);
  const [visitors, setVisitors] = useState(0);
  const [museumLevel, setMuseumLevel] = useState(1);
  const [explorerStatus, setExplorerStatus] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const UPGRADE_COST = 7;
  const ENTRY_FEE = 2;
  const EXPLORER_COST = 3;
  const INCOME = 2;
  const VISITOR_RATE = 5;
  const EXPLORATION_PERIOD = 3;

  const RANDOM_MARKET_COST = 4;

  const MAX_EXHIBITS = [3, 5, 7, 9, 12, 15, 17, 20];

  // รายชื่อสถานที่ และ Exhibits ที่สามารถสุ่มได้รับจากแต่ละที่
  const explorationAreas = [
    {
      name: "Ancient Ruins",
      exhibits: [
        {
          name: "🏺 Ancient Vase",
          points: 10,
          visitors: 2,
          rarity: "Common",
          price: 4,
        },
        {
          name: "🗿 Stone Idol",
          points: 15,
          visitors: 3,
          rarity: "Rare",
          price: 6,
        },
      ],
    },
    {
      name: "Pirate's Cove",
      exhibits: [
        {
          name: "⚓ Pirate's Treasure",
          points: 20,
          visitors: 5,
          rarity: "Rare",
          price: 8,
        },
        {
          name: "🏴‍☠️ Ancient Map",
          points: 25,
          visitors: 6,
          rarity: "Epic",
          price: 10,
        },
      ],
    },
    {
      name: "Royal Tomb",
      exhibits: [
        {
          name: "💎 Royal Crown",
          points: 30,
          visitors: 7,
          rarity: "Epic",
          price: 12,
        },
        {
          name: "⚰️ Pharaoh’s Mask",
          points: 35,
          visitors: 8,
          rarity: "Legendary",
          price: 15,
        },
      ],
    },
    {
      name: "Lost City",
      exhibits: [
        {
          name: "🦖 Dinosaur Fossil",
          points: 40,
          visitors: 10,
          rarity: "Legendary",
          price: 18,
        },
        {
          name: "🏛 Ancient Manuscript",
          points: 45,
          visitors: 12,
          rarity: "Epic",
          price: 20,
        },
      ],
    },
  ];

  const [market, setMarket] = useState(generateMarketItems());

  const randomEvents = [
    { id: 1, name: "กระแสโซเชียลมีเดีย Vistors + 10", effect: () => setVisitors(visitors + 10) },
    { id: 2, name: "ปัญหาไฟฟ้าขัดข้อง Visitors - 10%", effect: () => setVisitors((visitors * 10) / 100) },
    { id: 3, name: "ข้อเสนอจากเศรษฐี Coins + 10", effect: () => setMoney(money + 10) },
  ];

  useEffect(() => {
    if (turn % 5 === 0) {
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setEvents([...events, event]);
      event.effect();
    }
  }, [turn]);

  function generateMarketItems() {
    let items = [];
    for (let i = 0; i < 3; i++) {
      const area =
        explorationAreas[Math.floor(Math.random() * explorationAreas.length)];
      const exhibit =
        area.exhibits[Math.floor(Math.random() * area.exhibits.length)];
      items.push(exhibit);
    }
    return items;
  }

  const addExhibit = (exhibit) => {
    if (exhibits.length < MAX_EXHIBITS[museumLevel - 1]) {
      setExhibits([...exhibits, exhibit]);
      setScore(score + exhibit.points);
      setVisitors(visitors + exhibit.visitors);
    }
  };

  const nextTurn = () => {
    let totalIncome = INCOME;
    if (turn % 5 === 0) {
      const visitorIncome = Math.floor(visitors / VISITOR_RATE) * ENTRY_FEE;
      totalIncome += visitorIncome;
    }
    setTurn(turn + 1);
    setMoney(money + totalIncome);

    // ตรวจสอบว่านักสำรวจถึงเวลาส่ง Exhibits หรือยัง
    if (explorerStatus && explorerStatus.turnsLeft === 0) {
      const area = explorerStatus.area;
      const randomExhibit =
        area.exhibits[Math.floor(Math.random() * area.exhibits.length)]; // สุ่ม Exhibit ที่จะได้
      addExhibit(randomExhibit);
      setExplorerStatus(null);
    } else if (explorerStatus) {
      setExplorerStatus({
        ...explorerStatus,
        turnsLeft: explorerStatus.turnsLeft - 1,
      });
    }

    setMarket(generateMarketItems());
  };

  const sendExplorer = () => {
    if (money >= EXPLORER_COST && selectedArea) {
      setMoney(money - EXPLORER_COST);
      setExplorerStatus({ area: selectedArea, turnsLeft: EXPLORATION_PERIOD });
      setSelectedArea(null); // รีเซ็ตตัวเลือกสถานที่
    }
  };

  const buyExhibit = (exhibit) => {
    if (money >= exhibit.price) {
      setMoney(money - exhibit.price);
      addExhibit(exhibit);
      setMarket(market.filter((item) => item !== exhibit));
    }
  };

  const buyRandomExhibit = () => {
    if (money >= RANDOM_MARKET_COST) {
      setMoney(money - RANDOM_MARKET_COST);
      const randomArea =
        explorationAreas[Math.floor(Math.random() * explorationAreas.length)];
      const randomExhibit =
        randomArea.exhibits[
          Math.floor(Math.random() * randomArea.exhibits.length)
        ];
      addExhibit(randomExhibit);
    }
  };

  const resetGame = () => {
    setTurn(1);
    setMoney(3);
    setExhibits([]);
    setScore(0);
    setVisitors(0);
    setMuseumLevel(1);
  };

  const upgradeMuseum = () => {
    if (money >= UPGRADE_COST && museumLevel < MAX_EXHIBITS.length) {
      setMoney(money - UPGRADE_COST);
      setMuseumLevel(museumLevel + 1);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🏛 Museum Manager</h1>
      <p>🔄 Turn: {turn}</p>
      <p>💰 Money: {money} Coins</p>
      <p>
        🖼 Exhibits: {exhibits.length} / {MAX_EXHIBITS[museumLevel - 1]}
      </p>
      <p>⭐ Score: {score} Points</p>
      <p>👥 Visitors: {visitors}</p>
      <p>🏛 Museum Level: {museumLevel}</p>
      <p>📥 Entry Fee: {ENTRY_FEE} Coins</p>
      <p>
        💵 Income per turn:{" "}
        {INCOME + Math.floor(visitors / VISITOR_RATE) * ENTRY_FEE} Coins
      </p>
      <button
        style={{ marginLeft: "10px" }}
        onClick={() => setIsMarketOpen(true)}
      >
        🛒 เปิดตลาด
      </button>
      <button
        style={{ marginLeft: "10px" }}
        onClick={() => setIsExploreOpen(true)}
      >
        🌍 ส่งนักสำรวจ
      </button>
     
      {isMarketOpen && (
        <div className="modal">
          <h2>🛒 ตลาด Exhibits</h2>
          {market.map((item, index) => (
            <div key={index} style={{ margin: "10px" }}>
              <p>
                {item.name} - 💰 {item.price} Coins - ⭐ {item.points} Points -
                👥 {item.visitors} Visitors
                <span
                  style={{
                    color:
                      item.rarity === "Legendary"
                        ? "gold"
                        : item.rarity === "Epic"
                        ? "purple"
                        : item.rarity === "Rare"
                        ? "blue"
                        : "gray",
                  }}
                >
                  ({item.rarity})
                </span>
              </p>
             
              <button
                onClick={() => buyExhibit(item)}
                disabled={money < item.price}
              >
                ซื้อ Exhibit นี้
              </button>
              
            </div>
            
          ))}
           <button
                onClick={buyRandomExhibit}
                disabled={money < RANDOM_MARKET_COST}
              >
                🎲 ซื้อแบบสุ่ม - {RANDOM_MARKET_COST} Coins
              </button>
          <button onClick={() => setIsMarketOpen(false)}>ปิด</button>
        </div>
      )}

      {isExploreOpen && (
        <div className="modal">
          <h2>🌍 เลือกสถานที่สำรวจ</h2>
          {explorationAreas.map((area, index) => (
            <button
              key={index}
              onClick={() => setSelectedArea(area)}
              style={{ margin: "5px" }}
            >
              {area.name}
            </button>
          ))}

          <p>
            🌍 สถานที่ที่เลือก:{" "}
            {selectedArea ? selectedArea.name : "ยังไม่ได้เลือก"}
          </p>

          <button
            onClick={sendExplorer}
            disabled={!selectedArea || money < EXPLORER_COST || explorerStatus}
          >
            ส่งนักสำรวจ - {EXPLORER_COST} Coins
          </button>
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => setIsExploreOpen(false)}
          >
            ปิด
          </button>
        </div>
      )}

      <button
        style={{ marginLeft: "10px" }}
        onClick={upgradeMuseum}
        disabled={money < UPGRADE_COST || museumLevel >= MAX_EXHIBITS.length}
      >
        อัปเกรดพิพิธภัณฑ์ - {UPGRADE_COST} Coins
      </button>

      <button onClick={nextTurn} style={{ marginLeft: "10px" }}>
        Next Turn
      </button>

      {explorerStatus && (
        <p>
          นักสำรวจกำลังสำรวจ: {explorerStatus.area.name} (เหลือ{" "}
          {explorerStatus.turnsLeft} เทิร์น)
        </p>
      )}

      <button
        onClick={resetGame}
        style={{
          marginLeft: "45px",
          backgroundColor: "red",
          color: "white",
          padding: "10px",
        }}
      >
        เริ่มเกมใหม่
      </button>

      <div>
        {exhibits.map((ex, index) => (
          <p key={index}>
            {ex.name} - 👥 {ex.visitors} Visitors{" "}
            <span
              style={{
                color:
                  ex.rarity === "Legendary"
                    ? "gold"
                    : ex.rarity === "Epic"
                    ? "purple"
                    : ex.rarity === "Rare"
                    ? "blue"
                    : "gray",
              }}
            >
              ({ex.rarity})
            </span>{" "}
            - ⭐ {ex.points} Points
          </p>
        ))}
      </div>

      <h2>เหตุการณ์พิเศษ</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
