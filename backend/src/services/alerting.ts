// ===================================================================
// Breach Alert System — Discord Webhook + In-Memory Tracking
// Sends real-time alerts when suspicious activity is detected.
// ===================================================================

interface FailedAttempt {
  ip: string;
  email: string;
  timestamp: number;
}

// In-memory store for failed login attempts (per IP)
const failedAttempts = new Map<string, FailedAttempt[]>();

// Cooldown tracker to avoid spamming webhook
const alertCooldowns = new Map<string, number>();
const ALERT_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between alerts per IP

/**
 * Record a failed login attempt and trigger alert if threshold exceeded.
 */
export function recordFailedLogin(ip: string, email: string): void {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15-minute sliding window

  // Get or create entry for this IP
  if (!failedAttempts.has(ip)) {
    failedAttempts.set(ip, []);
  }

  const attempts = failedAttempts.get(ip)!;

  // Add new attempt
  attempts.push({ ip, email, timestamp: now });

  // Prune old attempts outside the window
  const recentAttempts = attempts.filter((a) => now - a.timestamp < windowMs);
  failedAttempts.set(ip, recentAttempts);

  // Check threshold
  const threshold = parseInt(
    process.env.FAILED_LOGIN_ALERT_THRESHOLD || "5",
    10
  );
  if (recentAttempts.length >= threshold) {
    triggerBreachAlert(ip, email, recentAttempts.length);
  }
}

/**
 * Clear failed attempts after successful login.
 */
export function clearFailedLogins(ip: string): void {
  failedAttempts.delete(ip);
}

/**
 * Send a breach alert to Discord webhook.
 */
async function triggerBreachAlert(
  ip: string,
  lastEmail: string,
  attemptCount: number
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "⚠️ DISCORD_WEBHOOK_URL not set — breach alert not sent to Discord."
    );
    console.warn(
      `🚨 BREACH ALERT: ${attemptCount} failed logins from IP ${ip} (last email: ${lastEmail})`
    );
    return;
  }

  // Check cooldown to avoid webhook spam
  const lastAlert = alertCooldowns.get(ip) || 0;
  if (Date.now() - lastAlert < ALERT_COOLDOWN_MS) {
    return; // Still in cooldown
  }
  alertCooldowns.set(ip, Date.now());

  const payload = {
    embeds: [
      {
        title: "🚨 Güvenlik Uyarısı — Şüpheli Giriş Denemesi",
        color: 0xff0000, // Red
        fields: [
          { name: "IP Adresi", value: `\`${ip}\``, inline: true },
          {
            name: "Son Denenen E-posta",
            value: `\`${lastEmail}\``,
            inline: true,
          },
          {
            name: "Başarısız Deneme Sayısı",
            value: `**${attemptCount}** (son 15 dakika)`,
            inline: true,
          },
          {
            name: "Zaman",
            value: new Date().toISOString(),
            inline: false,
          },
        ],
        footer: {
          text: "Alara Soysan Portfolio — Security Monitor",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `Discord webhook failed: ${response.status} ${response.statusText}`
      );
    } else {
      console.log(`🚨 Breach alert sent to Discord for IP ${ip}`);
    }
  } catch (err) {
    console.error("Failed to send Discord webhook:", err);
  }
}

/**
 * Send a general security event to Discord.
 */
export async function sendSecurityEvent(
  title: string,
  description: string,
  color: number = 0xffa500
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(`[SECURITY EVENT] ${title}: ${description}`);
    return;
  }

  const payload = {
    embeds: [
      {
        title: `🔒 ${title}`,
        description,
        color,
        timestamp: new Date().toISOString(),
        footer: { text: "Portfolio Security Monitor" },
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silent fail for non-critical events
  }
}
