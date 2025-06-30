import Hero from "./Hero"
import Steps from "./Steps"

export default () => {
  return (
      <section className="dark:bg-neutral-800 bg-neutral-200" >
            <div className="max-w-screen-xl mx-auto px-4 py-0 gap-12 darsk:bg-neutral-800 dark:text-gray-600 bg-neutral-200  md:px-8"></div>
          <Hero />
          <Steps />
          <div />
      </section>
  )
}