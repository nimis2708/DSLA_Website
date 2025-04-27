"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

type KnowledgeObject = {
  id: string
  title: string
  section: string
  level: string
  overview: string
  tags: string[]
}

export default function ExplorePage() {
  const [knowledgeObjects, setKnowledgeObjects] = useState<KnowledgeObject[]>([])
  const [searchTitle, setSearchTitle] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [searchOverview, setSearchOverview] = useState("")

  useEffect(() => {
    // Fetch knowledge objects from your FastAPI backend
    const fetchKnowledgeObjects = async () => {
      try {
        const res = await fetch("https://data-science-learning-accelerator.onrender.com/get-knowledge-objects")
        const data = await res.json()
        setKnowledgeObjects(data.data)  // Assuming FastAPI returns { "data": [...] }
      } catch (error) {
        console.error("Failed to fetch knowledge objects", error)
      }
    }

    fetchKnowledgeObjects()
  }, [])

  const filteredKOs = knowledgeObjects.filter((ko) => {
    const matchesTitle = ko.title.toLowerCase().includes(searchTitle.toLowerCase())
    const matchesLevel = selectedLevel && selectedLevel !== "all" ? ko.level === selectedLevel : true
    const matchesOverview = ko.overview.toLowerCase().includes(searchOverview.toLowerCase())
    return matchesTitle && matchesLevel && matchesOverview
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "knowledge-badge-beginner"
      case "Intermediate":
        return "knowledge-badge-intermediate"
      case "Advanced":
        return "knowledge-badge-advanced"
      default:
        return ""
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        {/* Search Bar and Filters */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Explore Knowledge Objects
          </h1>
          <p className="text-muted-foreground">
            Browse our collection of knowledge objects to accelerate your data science learning.
          </p>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title..."
              className="pl-8 border-education-200 focus-visible:ring-education-500"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="border-education-200 focus-visible:ring-education-500">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Search in overview..."
            className="border-education-200 focus-visible:ring-education-500"
            value={searchOverview}
            onChange={(e) => setSearchOverview(e.target.value)}
          />
        </div>

        {/* Knowledge Objects Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredKOs.map((ko) => (
            <Link href={`/ko/${ko.id}`} key={ko.id}>
              <Card className="h-full transition-all hover:shadow-md border-2 border-education-200 hover:border-education-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{ko.title}</CardTitle>
                  <CardDescription>{ko.section}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className={getLevelColor(ko.level)} variant="secondary">
                    {ko.level}
                  </Badge>
                  <p className="mt-3 text-sm text-muted-foreground">{ko.overview}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {ko.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-education-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

