import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { TutorialService } from "../../services/tutorial.service"
import type { Tutorial } from "../../models/tutorial.model"

@Component({
  selector: "app-tutorial-details",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./tutorial-details.component.html",
  styleUrls: ["./tutorial-details.component.css"],
})
export class TutorialDetailsComponent implements OnInit {
  currentTutorial: Tutorial = {}
  message = ""

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getTutorial(this.route.snapshot.params["id"])
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data
        console.log(data)
      },
      error: (e) => console.error(e),
    })
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      published: status,
    }

    this.message = ""

    this.tutorialService.update(this.currentTutorial.id, data).subscribe({
      next: (res) => {
        console.log(res)
        this.currentTutorial.published = status
        this.message = "The status was updated successfully!"
      },
      error: (e) => console.error(e),
    })
  }

  updateTutorial(): void {
    this.message = ""

    this.tutorialService.update(this.currentTutorial.id, this.currentTutorial).subscribe({
      next: (res) => {
        console.log(res)
        this.message = "The tutorial was updated successfully!"
      },
      error: (e) => console.error(e),
    })
  }

  deleteTutorial(): void {
    this.tutorialService.delete(this.currentTutorial.id).subscribe({
      next: (res) => {
        console.log(res)
        this.router.navigate(["/tutorials"])
      },
      error: (e) => console.error(e),
    })
  }
}