import { Button, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react"

function SetInterestedForm({contract}) {
  const [txnLoading, setTxnLoading] = useState(false)

  const [rent, setRent] = useState('')

  const handleClick = async() => {
    setTxnLoading(true)
    const txn = await contract.approveInterestedRenter(rent)
    const data = await txn.wait()

    console.log(data)
    setTxnLoading(false)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };

  return (
    <>
      <Input placeholder="renter address"  onChange={(e) => setRent(e.target.value)} />
      <Button onClick={() => handleClick()}>{txnLoading ? 'Loading' : 'Set'}</Button>
    </>
  )
}

export default SetInterestedForm