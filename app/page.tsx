export default function Home() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 flex flex-col items-center justify-center rounded-xl p-4">
          <p>Total balance</p>
          <p>-€43058.38</p>
        </div>
        <div className="bg-muted/50 flex flex-col items-center justify-center rounded-xl p-4">
          <p>You owe</p>
          <p>€43081.05</p>
        </div>
        <div className="bg-muted/50 flex flex-col items-center justify-center rounded-xl">
          <p>You are owed</p>
          <p>€22.67</p>
        </div>
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A adipisci
        dolore molestiae similique totam? Aspernatur dolor doloribus hic itaque,
        mollitia nobis, perferendis, praesentium recusandae sint suscipit
        tempora tenetur ullam veritatis.
      </div>
    </>
  )
}
