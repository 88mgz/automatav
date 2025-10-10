"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react"

interface QuizProps {
  title: string
  questions: Array<{
    prompt: string
    choices: string[]
    correctIndex: number
    explanation?: string
  }>
}

export function Quiz({ title, questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctIndex
  const isLastQuestion = currentQuestion === questions.length - 1

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
    if (isCorrect && !answeredQuestions.includes(currentQuestion)) {
      setScore(score + 1)
      setAnsweredQuestions([...answeredQuestions, currentQuestion])
    }
  }

  const handleNext = () => {
    if (isLastQuestion) return
    setCurrentQuestion(currentQuestion + 1)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions([])
  }

  return (
    <Card className="card-glass border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length} • Score: {score}/{questions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.prompt}</h3>
          <RadioGroup
            key={currentQuestion}
            value={selectedAnswer?.toString()}
            onValueChange={(v) => setSelectedAnswer(Number.parseInt(v))}
          >
            <div className="space-y-3">
              {question.choices.map((choice, i) => (
                <div
                  key={i}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? i === question.correctIndex
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : i === selectedAnswer
                          ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                          : "border-border/50"
                      : selectedAnswer === i
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={i.toString()} id={`q${currentQuestion}-${i}`} disabled={showResult} />
                  <Label htmlFor={`q${currentQuestion}-${i}`} className="flex-1 cursor-pointer text-sm leading-relaxed">
                    {choice}
                  </Label>
                  {showResult && i === question.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {showResult && i === selectedAnswer && i !== question.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {showResult && question.explanation && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">{question.explanation}</p>
          </div>
        )}

        <div className="flex gap-3">
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="flex-1">
              Submit Answer
            </Button>
          ) : isLastQuestion ? (
            <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Quiz
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              Next Question
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
