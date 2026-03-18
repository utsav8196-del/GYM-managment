import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, Share2 } from "lucide-react"
import { PageHero } from "@/components/page-hero"

type BlogPost = {
  _id: string
  title: string
  category?: string
  excerpt?: string
  image?: string
  publishedAt?: string
  author?: string
  readTime?: number
  content?: string
}

const fallbackBlogPosts: BlogPost[] = [
  {
    _id: "1",
    title: "Complete Guide to Gym Nutrition",
    category: "Nutrition",
    excerpt: "Master the fundamentals of nutrition to accelerate your fitness goals. Learn about macros, meal timing, and supplements.",
    image: "/images/blog-1.jpg",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: "John Trainer",
    readTime: 8,
    content: `
      <h2>Understanding Macronutrients</h2>
      <p>Nutrition is the foundation of any successful fitness journey. Understanding macronutrients - proteins, carbohydrates, and fats - is crucial for optimizing your performance and results.</p>

      <h3>Proteins: The Building Blocks</h3>
      <p>Proteins are essential for muscle repair and growth. Aim for 1.6-2.2 grams of protein per kilogram of body weight daily. Sources include chicken, fish, eggs, dairy, legumes, and protein supplements.</p>

      <h3>Carbohydrates: Your Energy Source</h3>
      <p>Carbs provide the energy needed for intense workouts. Complex carbohydrates like oats, sweet potatoes, and whole grains should make up the majority of your carb intake.</p>

      <h3>Fats: Essential for Hormone Production</h3>
      <p>Healthy fats are crucial for hormone production and nutrient absorption. Include avocados, nuts, olive oil, and fatty fish in your diet.</p>

      <h2>Meal Timing Strategies</h2>
      <p>Timing your meals around workouts can significantly impact your results. Consider eating a balanced meal 2-3 hours before training and having a protein-rich snack within 30-60 minutes post-workout.</p>

      <h2>Supplementation Guide</h2>
      <p>While whole foods should be your primary nutrition source, supplements can help fill nutritional gaps. Consider protein powder, creatine, multivitamins, and omega-3s based on your specific needs.</p>
    `,
  },
  {
    _id: "2",
    title: "Progressive Overload Training Secrets",
    category: "Training",
    excerpt: "Discover how to continuously challenge your muscles and break through plateaus with proven training techniques.",
    image: "/images/blog-2.jpg",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Mike Coach",
    readTime: 6,
    content: `
      <h2>What is Progressive Overload?</h2>
      <p>Progressive overload is the gradual increase of stress placed on the body during exercise training. It's the key principle that drives muscle growth and strength gains.</p>

      <h3>Methods to Implement Progressive Overload</h3>
      <ul>
        <li><strong>Increase Weight:</strong> Gradually add more weight to exercises as you get stronger</li>
        <li><strong>Increase Reps:</strong> Perform more repetitions with the same weight</li>
        <li><strong>Increase Sets:</strong> Add more sets to your workout routine</li>
        <li><strong>Decrease Rest Time:</strong> Reduce rest periods between sets</li>
        <li><strong>Improve Form:</strong> Focus on slower, more controlled movements</li>
      </ul>

      <h2>Avoiding Plateaus</h2>
      <p>Plateaus occur when your body adapts to your current training stimulus. To break through, implement periodization - planned variations in training intensity and volume.</p>

      <h3>Periodization Strategies</h3>
      <p>Use different training phases: accumulation (higher volume, lower intensity), intensification (lower volume, higher intensity), and deload weeks for recovery.</p>

      <h2>Tracking Progress</h2>
      <p>Keep a training log to monitor your progress. Track weights, reps, sets, and how you feel. This data helps you make informed decisions about when to increase intensity.</p>
    `,
  },
  {
    _id: "3",
    title: "Recovery & Rest Days for Peak Performance",
    category: "Recovery",
    excerpt: "Why rest days are crucial for muscle growth. Learn the science behind recovery and optimize your training schedule.",
    image: "/images/gallery-1.jpg",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Sarah Fit",
    readTime: 7,
    content: `
      <h2>The Science of Recovery</h2>
      <p>Recovery is when your body adapts to the stress of training and becomes stronger. Without adequate recovery, you risk overtraining, injury, and suboptimal results.</p>

      <h3>Types of Recovery</h3>
      <ul>
        <li><strong>Micro-recovery:</strong> Short breaks between sets (30-90 seconds)</li>
        <li><strong>Daily recovery:</strong> Rest days between training sessions</li>
        <li><strong>Weekly recovery:</strong> Deload weeks every 4-6 weeks</li>
        <li><strong>Monthly recovery:</strong> Complete breaks from training</li>
      </ul>

      <h2>Active Recovery Techniques</h2>
      <p>Active recovery involves low-intensity activities that promote blood flow and healing. Light walking, swimming, or yoga are excellent choices for rest days.</p>

      <h3>Sleep and Recovery</h3>
      <p>Sleep is the most important recovery tool. Aim for 7-9 hours of quality sleep per night. Poor sleep can negate all your training efforts.</p>

      <h2>Nutrition for Recovery</h2>
      <p>Post-workout nutrition should include protein for muscle repair and carbohydrates to replenish glycogen stores. Consider a 3:1 or 4:1 carb-to-protein ratio.</p>

      <h2>Signs of Overtraining</h2>
      <p>Watch for persistent fatigue, decreased performance, mood changes, and increased injury risk. If you notice these signs, take extra rest days.</p>
    `,
  },
  {
    _id: "4",
    title: "Transformation Stories: From Zero to Hero",
    category: "Motivation",
    excerpt: "Real member transformations that will inspire you. See what dedication and consistency can achieve.",
    image: "/images/gallery-2.jpg",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Lisa Weight",
    readTime: 5,
    content: `
      <h2>The Power of Consistency</h2>
      <p>Transformation isn't about quick fixes or extreme measures. It's about consistent, sustainable habits that compound over time.</p>

      <h3>Real Transformation Stories</h3>
      <p>Meet Sarah, who lost 50 pounds over 18 months through consistent training and nutrition. Her secret? Showing up 5 days a week, no matter what.</p>

      <p>Then there's Mike, who gained 25 pounds of muscle in his first year. His approach was simple: progressive overload, adequate protein, and patience.</p>

      <h2>Mindset Matters</h2>
      <p>The most successful transformations begin with a mindset shift. Focus on becoming healthier, not just looking different. Celebrate non-scale victories.</p>

      <h3>Common Challenges</h3>
      <ul>
        <li><strong>Plateaus:</strong> Expect them and know how to break through</li>
        <li><strong>Motivation dips:</strong> Build habits, not reliance on motivation</li>
        <li><strong>Social pressure:</strong> Focus on your journey, not comparisons</li>
      </ul>

      <h2>Sustainable Changes</h2>
      <p>Lasting transformation comes from lifestyle changes you can maintain. Find activities you enjoy and foods you love. This isn't a diet; it's a new way of life.</p>

      <h2>Your Journey Starts Today</h2>
      <p>Every expert was once a beginner. Every champion was once an amateur. Your transformation story is waiting to be written. Start small, stay consistent.</p>
    `,
  },
  {
    _id: "5",
    title: "Home Workout Routines That Actually Work",
    category: "Training",
    excerpt: "No gym equipment? No problem. Effective home workout routines for all fitness levels.",
    image: "/images/group-training.jpg",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Alex Strength",
    readTime: 9,
    content: `
      <h2>Bodyweight Training Fundamentals</h2>
      <p>You don't need fancy equipment to build strength and lose fat. Bodyweight exercises can provide an effective full-body workout anywhere, anytime.</p>

      <h3>Beginner Home Workout</h3>
      <p><strong>3 rounds of 10-15 reps each:</strong></p>
      <ul>
        <li>Push-ups (knee or wall variations)</li>
        <li>Bodyweight squats</li>
        <li>Plank (hold 20-30 seconds)</li>
        <li>Superman (back extensions)</li>
        <li>Glute bridges</li>
      </ul>

      <h2>Intermediate Routine</h2>
      <p><strong>4 rounds of 12-15 reps:</strong></p>
      <ul>
        <li>Standard push-ups</li>
        <li>Bulgarian split squats (one leg)</li>
        <li>Pull-ups (if you have a bar) or inverted rows</li>
        <li>Lunges (alternating legs)</li>
        <li>Russian twists</li>
      </ul>

      <h3>Advanced Home Training</h3>
      <p><strong>5 rounds with minimal rest:</strong></p>
      <ul>
        <li>Diamond push-ups</li>
        <li>Pistol squats (assisted if needed)</li>
        <li>Handstand push-ups (against wall)</li>
        <li>Burpees</li>
        <li>V-ups</li>
      </ul>

      <h2>Progression Strategies</h2>
      <p>Start with easier variations and gradually progress. Focus on perfect form before increasing difficulty. Track your workouts and aim to improve weekly.</p>

      <h2>Adding Resistance</h2>
      <p>Household items can add resistance: water bottles, backpacks filled with books, or resistance bands. Get creative with what you have available.</p>

      <h2>Workout Frequency</h2>
      <p>Train 3-5 days per week with rest days in between. Include mobility work and stretching on off days. Consistency beats intensity.</p>
    `,
  },
  {
    _id: "6",
    title: "Mental Health & Fitness Connection",
    category: "Wellness",
    excerpt: "How exercise boosts mental health. Science-backed tips for using fitness as your therapy.",
    image: "/images/personal-training.jpg",
    publishedAt: new Date().toISOString(),
    author: "Emma Mind",
    readTime: 10,
    content: `
      <h2>Exercise and Mental Health</h2>
      <p>Regular physical activity is one of the most effective ways to improve mental health. Exercise releases endorphins, reduces stress hormones, and improves sleep quality.</p>

      <h3>Scientific Evidence</h3>
      <p>Studies show that exercise can be as effective as medication for mild to moderate depression. It also helps with anxiety, PTSD, and ADHD symptoms.</p>

      <h2>How Exercise Helps</h2>
      <ul>
        <li><strong>Endorphin Release:</strong> Natural mood elevators</li>
        <li><strong>Stress Reduction:</strong> Lowers cortisol levels</li>
        <li><strong>Better Sleep:</strong> Improves sleep quality and duration</li>
        <li><strong>Increased Confidence:</strong> Achievement boosts self-esteem</li>
        <li><strong>Social Connection:</strong> Group classes build community</li>
      </ul>

      <h3>Types of Exercise for Mental Health</h3>
      <p><strong>Aerobic Exercise:</strong> Running, cycling, swimming - great for endorphin release</p>
      <p><strong>Strength Training:</strong> Builds confidence through progressive achievements</p>
      <p><strong>Yoga and Mindfulness:</strong> Combines physical movement with mental focus</p>
      <p><strong>Team Sports:</strong> Provides social interaction and belonging</p>

      <h2>Getting Started</h2>
      <p>Start small - even 10 minutes of daily movement can make a difference. Find activities you enjoy, not ones you dread. Consistency matters more than intensity.</p>

      <h2>When to Seek Professional Help</h2>
      <p>While exercise is beneficial, it's not a substitute for professional mental health treatment when needed. If you're struggling, reach out to a healthcare provider.</p>

      <h2>Mindful Movement</h2>
      <p>Pay attention to how your body feels during exercise. Use this time for mindfulness and stress relief. Focus on the present moment and your breathing.</p>
    `,
  },
]

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params
  const post = fallbackBlogPosts.find(p => p._id === id)

  if (!post) {
    return {
      title: "Blog Post Not Found | Zacson Fitness",
    }
  }

  return {
    title: `${post.title} | Zacson Fitness Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params
  const post = fallbackBlogPosts.find(p => p._id === id)

  if (!post) {
    notFound()
  }

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        breadcrumb={`Blog > ${post.title}`}
      />

      <section className="relative py-16 lg:py-24 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 mb-8"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          {/* Article Header */}
          <article className="space-y-8">
            {/* Featured Image */}
            <div className="relative aspect-video overflow-hidden rounded-2xl">
              <Image
                src={post.image || "/images/blog-1.jpg"}
                alt={post.title}
                fill
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute top-6 left-6 bg-primary/90 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                {post.category || "Fitness"}
              </div>
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground border-b border-border pb-8">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent"}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                {post.readTime || 5} min read
              </div>
              {post.author && (
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-primary" />
                  By {post.author}
                </div>
              )}
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: post.content || post.excerpt || "Content coming soon..." }}
            />

            {/* Share Section */}
            <div className="border-t border-border pt-8 mt-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground">Share this article:</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors duration-300">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag size={14} />
                  {post.category || "Fitness"}
                </div>
              </div>
            </div>

            {/* Related Articles CTA */}
            <div className="bg-primary/5 rounded-2xl p-8 text-center border border-primary/10 mt-12">
              <h3 className="text-xl font-bold text-foreground mb-4">Enjoyed this article?</h3>
              <p className="text-muted-foreground mb-6">Check out more fitness tips and training guides on our blog.</p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all duration-300"
              >
                Read More Articles
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}