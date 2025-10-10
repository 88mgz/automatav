"use client"

import { useState } from "react"
import type { QuizSection } from "@/lib/content-schema"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { CheckCircle2, XCircle } from "lucide-react"

interface QuizProps {
  section: QuizSection
  brandColor: string
}

export function Quiz({ section, brandColor }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleNext = () => {
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    section.questions.forEach((q, idx) => {
      if (q.correct && answers[idx] === q.correct) {
        totalScore += section.scoring?.correctPoints || 1
      }
    })
    setScore(totalScore)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
  }

  if (showResults && section.scoring?.showResults) {
    const maxScore = section.questions.length * (section.scoring?.correctPoints || 1)
    return (
      <Card>
        <CardHeader>
          <CardTitle>{section.title} - Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="text-5xl font-bold mb-2" style={{ color: brandColor }}>
              {score} / {maxScore}
            </div>
            <p className="text-muted-foreground">
              You got {score} out of {maxScore} questions correct!
            </p>
          </div>

          <div className="space-y-4">
            {section.questions.map((q, idx) => {
              const userAnswer = answers[idx]
              const isCorrect = q.correct && userAnswer === q.correct
              return (
                <div key={idx} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{q.prompt}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your answer: {q.choices.find((c) => c.value === userAnswer)?.label}
                      </p>
                      {!isCorrect && q.correct && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Correct answer: {q.choices.find((c) => c.value === q.correct)?.label}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button onClick={resetQuiz} className="w-full" style={{ backgroundColor: brandColor }}>
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  const question = section.questions[currentQuestion]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {section.title} - Question {currentQuestion + 1} of {section.questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-medium">{question.prompt}</p>

        <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswer}>
          <div className="space-y-3">
            {question.choices.map((choice, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={choice.value} id={`q${currentQuestion}-${idx}`} />
                <Label htmlFor={`q${currentQuestion}-${idx}`} className="cursor-pointer flex-1">
                  {choice.label}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
          className="w-full"
          style={{ backgroundColor: brandColor }}
        >
          {currentQuestion < section.questions.length - 1 ? "Next Question" : "See Results"}
        </Button>
      </CardContent>
    </Card>
  )
}
