import { Button, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react"

function SetRentForm({contract}) {
  const [txnLoading, setTxnLoading] = useState(false)

  const [rent, setRent] = useState(0)
  const [time, setTime] = useState(0)

  const handleClick = async() => {
    setTxnLoading(true)
    const txn = await contract.setPropertyRent(rent, time)
    const data = await txn.wait()

    console.log(data)
    setTxnLoading(false)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };

  return (
    <>
      <Input placeholder="rent" type={'number'} onChange={(e) => setRent(parseInt(e.target.value))} />
      <Input placeholder="deposit in months" type={'number'} onChange={(e) => setTime(parseInt(e.target.value))} />

      <Button onClick={() => handleClick()}>{txnLoading ? 'Loading' : 'Set'}</Button>
    </>
  )
}

export default SetRentForm