import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Play, Download, Sparkles, Video, Clock, Zap } from 'lucide-react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    setProgress(0)
    
    try {
      // Make API call to backend
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate video')
      }
      
      // Simulate progress for better UX
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 200)
      
      const videoData = await response.json()
      
      clearInterval(interval)
      setProgress(100)
      setIsGenerating(false)
      
      // Set the generated video data
      setGeneratedVideo({
        url: videoData.url,
        prompt: videoData.prompt,
        duration: videoData.duration,
        resolution: videoData.resolution,
        id: videoData.id
      })
      
    } catch (error) {
      console.error('Error generating video:', error)
      setIsGenerating(false)
      setProgress(0)
      // You could add error state handling here
      alert('Failed to generate video. Please try again.')
    }
  }

  const examplePrompts = [
    "A majestic eagle soaring through mountain peaks at sunset",
    "A futuristic city with flying cars and neon lights",
    "Ocean waves crashing against rocky cliffs in slow motion",
    "A magical forest with glowing fireflies at night"
  ]

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Generate videos in seconds" },
    { icon: Video, title: "HD Quality", desc: "High-resolution output" },
    { icon: Sparkles, title: "AI Powered", desc: "Advanced AI technology" },
    { icon: Clock, title: "Quick Turnaround", desc: "Instant results" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Video Generation</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6">
            Create Amazing Videos
            <br />
            <span className="text-5xl">from Text Prompts</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Transform your ideas into stunning videos using cutting-edge AI technology. 
            Simply describe what you want to see, and watch it come to life.
          </p>
        </div>

        {/* Main Generation Interface */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Video className="w-6 h-6 text-purple-400" />
                Video Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="text-white font-medium mb-3 block">
                  Describe your video:
                </label>
                <Textarea
                  placeholder="Describe the video you want to create... Be as detailed as possible for better results."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 resize-none"
                />
              </div>

              {/* Example Prompts */}
              <div>
                <p className="text-gray-300 text-sm mb-3">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((example, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-gray-300 px-3 py-1"
                      onClick={() => setPrompt(example)}
                    >
                      {example}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Generation Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Generating... {progress}%
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Generated Video Preview */}
              {generatedVideo && (
                <div className="mt-8">
                  <h3 className="text-white font-medium mb-4">Generated Video:</h3>
                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <div className="aspect-video bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                        <p className="text-gray-300">Video Preview</p>
                        <p className="text-sm text-gray-400">"{generatedVideo.prompt}"</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Duration: {generatedVideo.duration}</span>
                        <span>Resolution: {generatedVideo.resolution}</span>
                      </div>
                      <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Our AI Video Generator?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700 backdrop-blur-sm hover:bg-slate-800/50 transition-all">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-400">
          <p>&copy; 2024 AI Video Generator. Powered by advanced AI technology.</p>
        </footer>
      </div>
    </div>
  )
}

export default App

