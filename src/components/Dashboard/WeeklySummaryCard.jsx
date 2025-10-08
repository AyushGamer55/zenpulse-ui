import { useEffect, useState, useContext, useMemo } from "react";
import { DataContext } from "../../context/DataContext";
import { ThemeContext } from "../../context/ThemeContext";
import { Button } from "../../components/UI/button";

export default function WeeklySummaryCard() {
  const { allMessages, sentimentStats, sessionMessages } = useContext(DataContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const [showSummary, setShowSummary] = useState(false);

  // 🎯 ONLY SHOW IF USER HAS CHATTED IN THIS SESSION
  const hasSessionData = useMemo(() => {
    return sessionMessages.length > 0 && sessionMessages.some(msg => msg.sender === 'ai');
  }, [sessionMessages]);

  // 🎯 GENERATE DIFFERENT AI INSIGHTS BASED ON SESSION
  const sessionInsights = useMemo(() => {
    if (!hasSessionData) return null;

    const aiMessages = sessionMessages.filter(msg => msg.sender === 'ai' && msg.sentiment);
    const totalMessages = sessionMessages.length;
    const positiveCount = sentimentStats.positive || 0;
    const negativeCount = sentimentStats.negative || 0;
    const neutralCount = sentimentStats.neutral || 0;

       // Different report types based on session data - ENHANCED & ELABORATE
       const reportTypes = [
        {
          title: "🎭 Quantum Emotional Resonance",
          content: `Behold! In this magnificent tapestry of digital discourse, you've orchestrated ${totalMessages} symphonic expressions of consciousness. ${positiveCount} radiant beacons of positivity illuminate your neural pathways, while ${neutralCount} contemplative pauses allow profound introspection. ${negativeCount} cathartic releases demonstrate your remarkable emotional dexterity. Your psyche is evolving through these multidimensional exchanges, transcending ordinary human experience into transcendent self-awareness!`
        },
        {
          title: "💡 Neuroplastic Conversation Synergy",
          content: `Fascinating synaptic alchemy! Our cerebral collaboration has birthed ${aiMessages.length} algorithmic insights into your emotional quantum field. You're manifesting ${positiveCount > negativeCount ? 'stellar vibrational frequencies of optimism' : 'profound emotional metamorphosis'} through these exchanges. Each interaction recalibrates your consciousness matrix, forging neural pathways of unprecedented emotional intelligence and psychological resilience!`
        },
        {
          title: "📊 Sentient Data Constellation",
          content: `Astounding psychometric harmonics! Your conversational nebula exhibits ${Math.round((positiveCount / Math.max(totalMessages, 1)) * 100)}% luminous positivity quotient, with ${aiMessages.length} quantum-sentient interventions detecting emotional fluxuations. You're engineering psychological homeostasis through these interactions, creating a feedback loop of consciousness expansion that defies conventional emotional metrics!`
        },
        {
          title: "🤖 Consciousness Calibration Matrix",
          content: `Extraordinary phenomenological convergence! This ${totalMessages}-dimensional exchange reveals ${positiveCount > negativeCount ? 'optimistic quantum entanglement' : 'contemplative neural reconfiguration'} in your emotional superstructure. Every conversation catalyzes synaptic metamorphosis, evolving your consciousness toward unprecedented emotional enlightenment and psychological transcendence!`
        },
        {
          title: "🌟 Psychedelic Self-Discovery Nexus",
          content: `Mind-bending introspective odyssey! ${totalMessages} existential expressions have captured ${Math.round((positiveCount / Math.max(totalMessages, 1)) * 100)}% ecstatic positivity resonance in your consciousness stream. You're navigating profound psychological labyrinths, emerging with enhanced emotional acuity and transcendent self-understanding that defies mundane psychological frameworks!`
        }
      ];
    // Randomly select a report type
    const randomIndex = Math.floor(Math.random() * reportTypes.length);
    return reportTypes[randomIndex];
  }, [hasSessionData, sessionMessages, sentimentStats]);

  // 🎯 DON'T RENDER IF NO SESSION DATA
  if (!hasSessionData) {
    return null;
  }

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
        isDark ? "bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20" : "bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? "text-purple-300" : "text-purple-800"}`}>
              AI Session Insights
            </h2>
            <p className="text-xs text-muted-foreground">Real-time analytics</p>
          </div>
        </div>

        <Button
          onClick={() => setShowSummary(!showSummary)}
          variant={showSummary ? "destructive" : "default"}
          size="sm"
          className="px-4 py-2"
        >
          {showSummary ? 'Hide Report' : 'View Report'}
        </Button>
      </div>

      {showSummary && sessionInsights && (
        <div className="animate-fadeIn">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <span className="text-xl">{sessionInsights.title.split(' ')[0]}</span>
            </div>
            <div>
              <h3 className={`text-base font-bold ${isDark ? "text-purple-300" : "text-purple-800"}`}>
                {sessionInsights.title}
              </h3>
              <p className="text-xs text-muted-foreground">Session AI Analysis</p>
            </div>
          </div>

          <div className={`text-sm leading-relaxed ${isDark ? "text-purple-200" : "text-purple-900"}`}>
            {sessionInsights.content}
          </div>
        </div>
      )}
    </div>
  );
}