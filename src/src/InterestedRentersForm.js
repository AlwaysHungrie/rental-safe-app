import { Button, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react"

function InterestedRentersForm({contract}) {
  const [txnLoading, setTxnLoading] = useState(false)
  const [txn2Loading, setTxn2Loading] = useState(false)


  const [time, setTime] = useState(0)

  const handleClick = async() => {
    setTxnLoading(true)
    const txn = await contract.updateInterestedRenter(time)
    const data = await txn.wait()

    console.log(data)
    setTxnLoading(false)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };

  const handleClick2 = async() => {
    setTxnLoading(true)
    const txn = await contract.removeInterestedRenter()
    const data = await txn.wait()

    console.log(data)
    setTxnLoading(false)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };

  return (
    <>
      <Input placeholder="lock in period in months" type={'number'} onChange={(e) => setTime(parseInt(e.target.value))} />

      <Button onClick={() => handleClick()}>{txnLoading ? 'Loading' : 'Add'}</Button>
      <Button onClick={() => handleClick2()}>{txn2Loading ? 'Loading' : 'Remove'}</Button>
    </>
  )
}

export default InterestedRentersForm